## Grant Carrier Privilege to Android App by Writing SIM Cards

### Background and How-To

Reference: https://source.android.com/devices/tech/config/uicc

The term `SIM Card` we use usually refers to a UICC (Universal Integrated Circuit Card), which is a smart card that has various Java applets installed. There is a special applet on the card called ARA (Access Rule Applet). When Android checks for carrier privilege, it loads access rule from ARA and checks if the hash of certificate that signs the app is present. The format of the UICC rule can be found [here](https://source.android.com/devices/tech/config/uicc).

We can use a smart card reader/writer to talk with a UICC using APDU commands. The specs of APDU command that Android uses can be found [here](https://globalplatform.org/specs-library/). Each APDU command is a sequence of bytes that specifies the instruction to perform and data associated with the instruction. Since each applet on UICC has a unique AID, we can, for example, first `SELECT` ARA using AID `A00000015141434C00` and then `LOAD` new access rule that contains the app's hash to ARA.

Resources:
* [APDU response status codes](https://github.com/Proxmark/proxmark3/blob/master/client/emv/apduinfo)
* Android UICC Carrier Privilege Source Code
 * [UiccCarrierPrivilegeRules.java](https://android.googlesource.com/platform/frameworks/opt/telephony/+/master/src/java/com/android/internal/telephony/uicc/UiccCarrierPrivilegeRules.java)
 * [UiccAccessRule.java](https://android.googlesource.com/platform/frameworks/base/+/master/telephony/java/android/telephony/UiccAccessRule.java)

### Requirements

Below are requirements that the UICC card must satisfy to grant carrier privilege to the app:
1. Java card that is compatible with [GlobalPlatform Secure Element Access Control Specification](https://globalplatform.org/specs-library/) and ISO 7816.
2. Is ready for personalization or have a transport key from the manufacturer. More information [here](https://stackoverflow.com/questions/27765335/smart-card-pre-personalization-and-historical-bytes).

### Method 1

We can use existing Python library (e.g. `pyscard`) to talk with and send APDU commands directly to the card. Procedure below as well as code in `load_cert_hash.py` should help outline high-level steps but has not been tested.

#### Packages
* Install `Python`
* Install `pyscard` by following instructions here: https://pyscard.sourceforge.io/#download

Verify that `pyscard` is correctly installed by making sure the following command runs without errors:
```shell
python -c 'import smartcard'
```

#### Run

Script `load_cert_hash.py` performs the following:
1. Use `SELECT` command to select ARA using AID `A00000015141434C00`.
2. Use `LOAD` command to load the app certificate hash as a new rule to ARA.

```shell
python ./load_cert_hash.py
```

### Method 2

We can use an open source Java card implementation `GlobalPlatformPro` to load ARA rules directly to the card.

#### Steps
1. Download and build `GlobalPlatformPro` by following the instructions [here](https://github.com/martinpaljak/GlobalPlatformPro).
2. Use [gp -acr-list](https://github.com/martinpaljak/GlobalPlatformPro/wiki/Secure-Element-Access-Control) command to add app certificate hash to AID `A00000015141434C00`:

  ```
  gp -acr-add -acr-rule 01 -app A00000015141434C00 -acr-hash <certificate-hash>

  ```

### Current Progress

1. Currently we have [ACOSJ Java cards](https://www.smartcardfocus.us/shop/ilp/id~820/acosj-contact-only-java-card-40k-sim-cut/p/index.shtml). However, we do not have transport key from the manufacturer so we cannot load ARA rule to the card.

2. Once we have card that is ready for personalization, we need to test and modify one of the or both methods above to load our app certificate hash as an ARA rule on the card.
