# Firestore Schema

This document outlines the collections and data structures used in Firestore for the AmpleSauce application.

**A Note on Field Names**: To optimize for storage costs and performance, field names in Firestore are shortened. This document lists the full, descriptive name for clarity, followed by the actual shortened field name in square brackets, like this: `descriptiveName [dN]`.

## `/users/{uid}`

Stores private user data, primarily for authentication and settings. The `uid` is the user's unique Firebase Authentication ID.

- **displayName** `[dN]`: `string` - The user's chosen display name.
- **email** `[e]`: `string` - The user's email address.
(TODO - Finish this document!)