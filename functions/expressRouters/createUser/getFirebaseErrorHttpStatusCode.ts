// The list of Firebase auth errors: https://firebase.google.com/docs/auth/admin/errors

export default function getFirebaseErrorHttpStatusCode(errorCode: string) {
  // Errors corresponding to 400 Bad Request
  const badRequestErrors = [
    "auth/claims-too-large",
    "auth/email-already-exists",
    "auth/email-already-in-use", // Added manually
    "auth/id-token-expired", // Can also be 401
    "auth/invalid-argument",
    "auth/invalid-claims",
    "auth/invalid-continue-uri",
    "auth/invalid-creation-time",
    "auth/invalid-credential",
    "auth/invalid-disabled-field",
    "auth/invalid-display-name", // Depends on implementation
    "auth/invalid-dynamic-link-domain",
    "auth/invalid-email",
    "auth/invalid-email-verified",
    "auth/invalid-hash-algorithm",
    "auth/invalid-hash-block-size",
    "auth/invalid-hash-derived-key-length",
    "auth/invalid-hash-key",
    "auth/invalid-hash-memory-cost",
    "auth/invalid-hash-parallelization",
    "auth/invalid-hash-rounds",
    "auth/invalid-hash-salt-separator",
    "auth/invalid-id-token",
    "auth/invalid-last-sign-in-time",
    "auth/invalid-page-token",
    "auth/invalid-password",
    "auth/invalid-password-hash",
    "auth/invalid-password-salt",
    "auth/invalid-phone-number",
    "auth/invalid-photo-url", // Depends on implementation
    "auth/invalid-provider-data",
    "auth/invalid-provider-id",
    "auth/invalid-oauth-responsetype",
    "auth/invalid-uid",
    "auth/invalid-session-cookie-duration",
    "auth/missing-android-pkg-name",
    "auth/missing-continue-uri",
    "auth/missing-hash-algorithm",
    "auth/missing-ios-bundle-id",
    "auth/missing-oauth-client-secret",
    "auth/missing-uid",
    "auth/reserved-claims",
    "auth/unauthorized-continue-uri"
  ];

  // Errors corresponding to 401 Unauthorized
  const unauthorizedErrors = [
    "auth/id-token-expired", // Can also be 400
    "auth/id-token-revoked",
    "auth/insufficient-permission",
    "auth/session-cookie-expired",
    "auth/session-cookie-revoked"
  ];

  // Errors corresponding to 403 Forbidden
  const forbiddenErrors = ["auth/maximum-user-count-exceeded", "auth/operation-not-allowed"];

  // Errors corresponding to 404 Not Found
  const notFoundErrors = ["auth/project-not-found", "auth/user-not-found"];
  
  // Errors corresponding to 409 Conflict
  const confictErrors = ["auth/phone-number-already-exists", "auth/uid-already-exists"];
  
  // Errors corresponding to 422 Unprocessable Content
  const unprocessableErrors = ["auth/invalid-user-import"];

  // Errors corresponding to 429 Too Many Requests
  const tooManyRequestsErrors = ["auth/too-many-requests"];

  // Errors corresponding to 500 Internal Server Error
  const internalErrors = ["auth/internal-error"];

  if(badRequestErrors.includes(errorCode)) return 400;
  if(unauthorizedErrors.includes(errorCode)) return 401;
  if(forbiddenErrors.includes(errorCode)) return 403;
  if(notFoundErrors.includes(errorCode)) return 404;
  if(confictErrors.includes(errorCode)) return 409;
  if(unprocessableErrors.includes(errorCode)) return 422;
  if(tooManyRequestsErrors.includes(errorCode)) return 429;
  if(internalErrors.includes(errorCode)) return 500;

  console.error(`Unknown firebase error code: ${errorCode}.`);
  return 500;
}