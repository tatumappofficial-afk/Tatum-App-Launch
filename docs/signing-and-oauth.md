# Signing keys & Google OAuth setup

Reference for the Android signing certificates and how they map to the Google
OAuth clients used by Google Sign-In. **SHA-1/SHA-256 fingerprints are public**
(derivable from any signed build) — not secrets. The actual keystores live in
EAS and in Google Play App Signing, never in this repo.

## Android signing certificate fingerprints

| Key | SHA-1 | Where it comes from | What it signs |
|-----|-------|---------------------|---------------|
| **Debug** | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` | project-local `android/app/debug.keystore` | local `expo run:android` / dev builds |
| **Upload** | `3D:BE:C5:57:72:31:D7:E5:3E:79:65:54:32:57:AD:20:CF:23:3F:09` | EAS-managed keystore (`Build Credentials RXi5C6VBGc`) | EAS build artifacts before Play re-signs them; directly-sideloaded production APKs |
| **App Signing** | `F1:88:57:C0:D7:24:D2:6C:B8:74:80:2A:51:77:3A:A7:EA:AE:EC:B1`<br>SHA-256 `87a416fbc1ed79f43f1bcfe84ab9bd1dd184848ac504bc847544991145cd48b1` | Google Play App Signing key (Play Console → App integrity → App signing) | **every app delivered through Play** (internal testing + production). This is what installed apps are actually signed with. |

## Google OAuth clients (project `project-492ba181-a904-4ba2-b23`, number `242699264391`)

Google Sign-In validates the calling app's `(package name, SHA-1)` against **all**
Android OAuth clients in the project — a match on any one is sufficient. The newer
"Google Auth Platform" Clients UI allows **one SHA-1 per Android client**, so the
keys are spread across the two Android clients.

| Client | Type | Package | SHA-1 it carries |
|--------|------|---------|------------------|
| Tatum Android (EAS) | Android | `com.tatumapp.tatum` | App Signing key `F1:88:…` *(set so Play-distributed installs can sign in)* |
| Tatum Android | Android | `com.tatumapp.tatum` | (the other key, e.g. debug, if dev sign-in is needed) |
| Tatum Web | Web | — | used as `webClientId` in `GoogleSignin.configure` (the token audience) |
| Tatum iOS | iOS | `com.tatumapp.tatum` | bundle-ID based, no SHA-1 |

## Why a Play install fails sign-in if the App Signing SHA-1 isn't registered

Local/debug builds use the debug key (registered → work). Builds shipped through
Play are **re-signed by Google with the App Signing key**, whose SHA-1 differs. If
that SHA-1 isn't on an Android OAuth client, Google Sign-In returns
`DEVELOPER_ERROR` (code 10). Registering the App Signing SHA-1 (above) is the fix —
no rebuild required.
