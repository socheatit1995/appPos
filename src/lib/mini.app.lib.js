/**
 * MiniApp JS SDK (mini.app.lib.js)
 * Cross-platform JavaScript bridge supporting Android (WebView) and iOS (WKWebView).
 */
(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(global);
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(global);
    });
  } else {
    global.MiniApp = factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function (window) {
  'use strict';

  // Constants
  const SERVICE_TYPES = {
    MOBILE_TOPUP: 'MOBILE_TOPUP',
    BILL_PAYMENT: 'BILL_PAYMENT',
    KHQR_PURCHASE: 'KHQR_PURCHASE',
    CARD_PAYMENT: 'CARD_PAYMENT'
  };

  /**
   * Detect current platform
   */
  const Platform = {
    isAndroid: function () {
      return (
        typeof window !== 'undefined' &&
        (Boolean(window.PaymentBridge) ||
          Boolean(window.SuperApp) ||
          Boolean(window.BMCManager) ||
          /android/i.test(navigator.userAgent))
      );
    },
    isIOS: function () {
      return (
        typeof window !== 'undefined' &&
        Boolean(window.webkit && window.webkit.messageHandlers)
      );
    }
  };

  /**
   * Helper to generate unique callback names
   */
  let callbackIdCounter = 0;
  function createUniqueCallbackName(prefix) {
    callbackIdCounter = (callbackIdCounter + 1) % 1000000;
    return `__miniAppCallback_${prefix || 'cb'}_${Date.now()}_${callbackIdCounter}`;
  }

  /**
   * MiniApp SDK Core Object
   */
  const MiniApp = {
    version: '1.1.0',
    ServiceType: SERVICE_TYPES,

    /**
     * Get platform information
     */
    getPlatform: function () {
      if (Platform.isIOS()) return 'ios';
      if (Platform.isAndroid()) return 'android';
      return 'web';
    },

    /**
     * Request SSO / User session token
     * @param {Object|string} [options] - Options object { appKey?: string } or appKey string
     * @returns {Promise<string>}
     */
    getToken: function (options) {
      const appKey = typeof options === 'string' ? options : (options && options.appKey) || null;
      return new Promise(function (resolve, reject) {
        try {
          // Android SuperApp interface
          if (window.SuperApp) {
            let resRaw;
            if (typeof window.SuperApp.getSessionTokenWithKey === 'function') {
              resRaw = window.SuperApp.getSessionTokenWithKey(appKey);
            } else if (typeof window.SuperApp.getSessionToken === 'function') {
              resRaw = window.SuperApp.getSessionToken();
            }

            if (resRaw) {
              try {
                const parsed = JSON.parse(resRaw);
                if (parsed.status === 'ERROR') {
                  return reject(parsed);
                }
                if (parsed.token !== undefined) {
                  return resolve(parsed.token);
                }
              } catch (e) {
                // Return plain string if not json
                return resolve(resRaw);
              }
            }
            return resolve(resRaw || '');
          }

          // iOS WKWebView MessageHandler
          if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.SuperApp &&
            typeof window.webkit.messageHandlers.SuperApp.postMessage === 'function'
          ) {
            const callbackName = createUniqueCallbackName('getToken');
            window[callbackName] = function (res) {
              delete window[callbackName];
              if (res && res.status === 'ERROR') {
                reject(res);
              } else {
                resolve(typeof res === 'string' ? res : (res && res.token) || '');
              }
            };
            window.webkit.messageHandlers.SuperApp.postMessage({
              action: 'getToken',
              appKey: appKey,
              callback: callbackName
            });
            return;
          }

          // Fallback / Standalone Web
          resolve('');
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Request User Profile from Super App
     * @param {Object|string} [options] - Options object { appKey?: string } or appKey string
     * @returns {Promise<Object>} Resolves with { userId, name, phoneNumber, email, avatarUrl, ... }
     */
    getUserProfile: function (options) {
      const appKey = typeof options === 'string' ? options : (options && options.appKey) || null;
      return new Promise(function (resolve, reject) {
        try {
          // Android SuperApp interface
          if (window.SuperApp) {
            let profileRaw;
            if (typeof window.SuperApp.getUserProfileWithKey === 'function') {
              profileRaw = window.SuperApp.getUserProfileWithKey(appKey);
            } else if (typeof window.SuperApp.getUserProfile === 'function') {
              profileRaw = window.SuperApp.getUserProfile();
            }

            if (typeof profileRaw === 'string') {
              try {
                const parsed = JSON.parse(profileRaw);
                if (parsed.status === 'ERROR') {
                  return reject(parsed);
                }
                if (parsed.data) {
                  return resolve(parsed.data);
                }
                return resolve(parsed);
              } catch (e) {
                return resolve({ raw: profileRaw });
              }
            } else {
              return resolve(profileRaw || {});
            }
          }

          // iOS WKWebView MessageHandler
          if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.SuperApp &&
            typeof window.webkit.messageHandlers.SuperApp.postMessage === 'function'
          ) {
            const callbackName = createUniqueCallbackName('getUserProfile');
            window[callbackName] = function (res) {
              delete window[callbackName];
              if (res && res.status === 'ERROR') {
                return reject(res);
              }
              if (typeof res === 'string') {
                try {
                  const parsed = JSON.parse(res);
                  if (parsed.data) return resolve(parsed.data);
                  return resolve(parsed);
                } catch (e) {
                  return resolve({ raw: res });
                }
              } else {
                return resolve((res && res.data) || res || {});
              }
            };
            window.webkit.messageHandlers.SuperApp.postMessage({
              action: 'getUserProfile',
              appKey: appKey,
              callback: callbackName
            });
            return;
          }

          // Fallback / Standalone Web mock
          resolve({
            userId: 'usr_guest',
            name: 'Guest User',
            phoneNumber: '012 345 678',
            email: 'guest@smart.com.kh',
            avatarUrl: '',
            token: ''
          });
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Request payment with native host container
     * @param {Object} payload
     * @param {string} payload.serviceType - MOBILE_TOPUP | BILL_PAYMENT | KHQR_PURCHASE | CARD_PAYMENT
     * @param {string} payload.prepayId - Unique transaction/order prepay identifier
     * @param {number} payload.amount - Payment amount (must be > 0)
     * @param {string} payload.currency - Currency code (e.g., 'USD', 'KHR')
     * @param {string} payload.partnerCode - Partner/merchant identifier
     * @param {Object} [payload.metadata] - Extra custom parameters
     * @returns {Promise<Object>} Resolves with { status: "SUCCESS", transactionId: string, data: Object }
     */
    requestPayment: function (payload) {
      return new Promise(function (resolve, reject) {
        // Basic payload validations
        if (!payload || typeof payload !== 'object') {
          return reject({
            status: 'ERROR',
            errorCode: 'INVALID_PAYLOAD',
            errorMessage: 'Payment payload must be an object'
          });
        }

        const validServices = Object.values(SERVICE_TYPES);
        if (!payload.serviceType || !validServices.includes(payload.serviceType)) {
          return reject({
            status: 'ERROR',
            errorCode: 'INVALID_SERVICE_TYPE',
            errorMessage: `Invalid serviceType. Must be one of: ${validServices.join(', ')}`
          });
        }

        if (!payload.prepayId || typeof payload.prepayId !== 'string') {
          return reject({
            status: 'ERROR',
            errorCode: 'MISSING_PREPAY_ID',
            errorMessage: 'prepayId is required and must be a string'
          });
        }

        if (typeof payload.amount !== 'number' || payload.amount <= 0 || isNaN(payload.amount)) {
          return reject({
            status: 'ERROR',
            errorCode: 'INVALID_AMOUNT',
            errorMessage: 'amount must be a valid number greater than 0'
          });
        }

        if (!payload.currency) {
          return reject({
            status: 'ERROR',
            errorCode: 'MISSING_CURRENCY',
            errorMessage: 'currency is required (e.g. USD, KHR)'
          });
        }

        if (!payload.partnerCode) {
          return reject({
            status: 'ERROR',
            errorCode: 'MISSING_PARTNER_CODE',
            errorMessage: 'partnerCode is required'
          });
        }

        const normalizedPayload = {
          serviceType: payload.serviceType,
          prepayId: payload.prepayId,
          amount: payload.amount,
          currency: String(payload.currency).toUpperCase(),
          partnerCode: payload.partnerCode,
          metadata: payload.metadata || {}
        };

        const callbackName = createUniqueCallbackName('payment');

        // Cleanup helper
        function cleanup() {
          try {
            delete window[callbackName];
          } catch (e) {
            window[callbackName] = undefined;
          }
          if (typeof window.removeEventListener === 'function') {
            window.removeEventListener('SuperAppPaymentResult', handleCustomEvent);
          }
        }

        // Process response data
        function handleResponse(response) {
          cleanup();

          if (typeof response === 'string') {
            try {
              response = JSON.parse(response);
            } catch (e) {
              // keep as string
            }
          }

          // Check if response indicates success
          const isSuccess =
            response &&
            (response.status === 'SUCCESS' ||
              response.status === 'success' ||
              response.code === '00' ||
              response.code === 200 ||
              response.success === true);

          if (isSuccess) {
            resolve(typeof response === 'object' ? response : { status: 'SUCCESS', data: response });
          } else {
            const errorObj = typeof response === 'object' && response !== null
              ? response
              : { status: 'FAILED', errorMessage: String(response || 'Payment failed') };
            reject(errorObj);
          }
        }

        // 1. Direct callback handler called by native bridge
        window[callbackName] = function (response) {
          handleResponse(response);
        };

        // 2. CustomEvent 'SuperAppPaymentResult' listener dispatched by native bridge
        function handleCustomEvent(event) {
          if (event && event.detail) {
            handleResponse(event.detail);
          }
        }
        if (typeof window.addEventListener === 'function') {
          window.addEventListener('SuperAppPaymentResult', handleCustomEvent, { once: true });
        }

        // 3. Hook global onPaymentResult fallback
        const prevOnPaymentResult = window.onPaymentResult;
        window.onPaymentResult = function (response) {
          if (typeof prevOnPaymentResult === 'function') {
            try { prevOnPaymentResult(response); } catch (e) { }
          }
          handleResponse(response);
        };

        const jsonString = JSON.stringify(normalizedPayload);

        // --- Android Call Execution ---
        if (window.PaymentBridge && typeof window.PaymentBridge.makePayment === 'function') {
          window.PaymentBridge.makePayment(jsonString, callbackName);
          return;
        }

        if (window.SuperApp && typeof window.SuperApp.requestPayment === 'function') {
          window.SuperApp.requestPayment(jsonString, callbackName);
          return;
        }

        if (window.SuperApp && typeof window.SuperApp.pay === 'function') {
          window.SuperApp.pay(jsonString, callbackName);
          return;
        }

        // --- iOS (WKWebView MessageHandler) Call Execution ---
        if (
          window.webkit &&
          window.webkit.messageHandlers &&
          (window.webkit.messageHandlers.PaymentBridge || window.webkit.messageHandlers.paymentBridge)
        ) {
          const handler =
            window.webkit.messageHandlers.PaymentBridge || window.webkit.messageHandlers.paymentBridge;
          handler.postMessage({
            payload: normalizedPayload,
            jsonPayload: jsonString,
            callback: callbackName
          });
          return;
        }

        // --- Legacy/Fallback BMCManager Interface ---
        if (window.BMCManager && typeof window.BMCManager.showPurchaseBottomSheet === 'function') {
          window.BMCManager.showPurchaseBottomSheet(
            JSON.stringify({
              sheetTitle: `Payment: ${normalizedPayload.serviceType}`,
              packName: normalizedPayload.partnerCode,
              packPrice: `${normalizedPayload.amount} ${normalizedPayload.currency}`,
              description: `Prepay ID: ${normalizedPayload.prepayId}`
            })
          );
          resolve({
            status: 'SUCCESS',
            transactionId: 'TXN_' + Date.now(),
            data: normalizedPayload
          });
          return;
        }

        // --- In case no native bridge is detected (development mode) ---
        console.warn('[MiniApp JS SDK] Native payment bridge not found (Running in standalone browser). Waiting for native container.');
        setTimeout(function () {
          if (window[callbackName]) {
            window[callbackName]({
              status: 'SUCCESS',
              transactionId: 'MOCK_TXN_' + Date.now(),
              data: normalizedPayload
            });
          }
        }, 800);
      });
    },

    /**
     * Exit the MiniApp container with an optional native confirmation dialog
     * @param {boolean} [showConfirmationDialog=true] - If true, displays native confirmation dialog
     */
    exit: function (showConfirmationDialog) {
      const showConfirm = showConfirmationDialog !== false; // defaults to true

      // 1. Android SuperApp Interface
      if (window.SuperApp && typeof window.SuperApp.exitMiniApp === 'function') {
        window.SuperApp.exitMiniApp(showConfirm);
        return;
      }

      // 2. Android MiniAppBridge Interface
      if (window.MiniAppBridge && typeof window.MiniAppBridge.close === 'function') {
        window.MiniAppBridge.close(JSON.stringify({ showConfirm: showConfirm }));
        return;
      }

      // 3. iOS MessageHandler
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.closeMiniApp
      ) {
        window.webkit.messageHandlers.closeMiniApp.postMessage({ showConfirmation: showConfirm });
        return;
      }

      // 4. Browser fallback
      if (showConfirm) {
        if (window.confirm("Are you sure you want to exit?")) {
          window.history.back();
        }
      } else {
        window.history.back();
      }
    },

    /**
     * Close current MiniApp (Alias to exit)
     * @param {Object|boolean} [options] - Options object or boolean for confirmation dialog
     */
    close: function (options) {
      if (typeof options === 'boolean') {
        this.exit(options);
      } else if (options && typeof options.showConfirm === 'boolean') {
        this.exit(options.showConfirm);
      } else {
        this.exit(false);
      }
    }
  };

  return MiniApp;
});
