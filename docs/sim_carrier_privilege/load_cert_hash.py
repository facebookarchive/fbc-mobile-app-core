# Copyright (c) Facebook, Inc. and its affiliates.
# All rights reserved.
#
# This source code is licensed under the BSD-style license found in the
# LICENSE file in the root directory of this source tree.

##
# reference:
# https://pyscard.sourceforge.io/pyscard-wrapper.html#wrapper-samples
##

from __future__ import print_function

from smartcard.scard import (
    SCARD_PROTOCOL_T0,
    SCARD_PROTOCOL_T1,
    SCARD_S_SUCCESS,
    SCARD_SCOPE_USER,
    SCARD_SHARE_SHARED,
    SCARD_UNPOWER_CARD,
    SCardConnect,
    SCardDisconnect,
    SCardEstablishContext,
    SCardGetErrorMessage,
    SCardListReaders,
    SCardReleaseContext,
    SCardTransmit,
    error,
)
from smartcard.util import HEX, toHexString


# APDU Commands
# Select ARA application
SELECT = [0x80, 0xA4, 0x04, 0x00]
ARA_AID = [0xA0, 0x00, 0x00, 0x01, 0x51, 0x41, 0x43, 0x4C, 0x00]
LE = [0x00]
SELECT_ARA = SELECT + [len(ARA_AID)] + LE

# The rule to load
# Please check the certificate hash of your app
CERT_HASH = [
    0x5E,
    0x8F,
    0x16,
    0x06,
    0x2E,
    0xA3,
    0xCD,
    0x2C,
    0x4A,
    0x0D,
    0x54,
    0x78,
    0x76,
    0xBA,
    0xA6,
    0xF3,
    0x8C,
    0xAB,
    0xF6,
    0x25,
]
PERM_AR_DO = [0xDB, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]
AR_DO = [0xE3, 0x0A] + PERM_AR_DO
DEVICE_REF_DO = [0xC1] + [len(CERT_HASH)] + CERT_HASH
REF_DO = [0xE1] + [len(DEVICE_REF_DO)] + DEVICE_REF_DO
REF_AR_DO = [0xE2] + [len(REF_DO)] + [len(AR_DO)] + REF_DO + AR_DO

# Load new rule to ARA
# TODO: figure out the correct load command
LOAD = []


def print_hex_response(response):
    print("response: " + toHexString(response, HEX))


def transmit_command(command):
    hresult, response = SCardTransmit(hcard, dwActiveProtocol, command)
    if hresult != SCARD_S_SUCCESS or response[1] != 0x9F:
        raise error("Failed to select ARA: " + SCardGetErrorMessage(hresult))
    print_hex_response(response)


if __name__ == "__main__":
    try:
        hresult, hcontext = SCardEstablishContext(SCARD_SCOPE_USER)
        if hresult != SCARD_S_SUCCESS:
            raise error(
                "Failed to establish context : " + SCardGetErrorMessage(hresult)
            )
        print("Context established!")

        hresult, readers = SCardListReaders(hcontext, [])
        if hresult != SCARD_S_SUCCESS:
            raise error("failed to get readers: " + SCardGetErrorMessage(hresult))
        print("readers:", readers)

        if len(readers) < 1:
            raise error("No smart card readers")

        # default to select first reader
        reader = readers[0]
        print("select reader:", reader)

        try:
            # connect to card
            hresult, hcard, dwActiveProtocol = SCardConnect(
                hcontext,
                reader,
                SCARD_SHARE_SHARED,
                SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1,
            )
            if hresult != SCARD_S_SUCCESS:
                raise error("Unable to connect: " + SCardGetErrorMessage(hresult))
            print("Connected with active protocol", dwActiveProtocol)

            # select ARA application
            transmit_command(SELECT_ARA)
            # load new rule to ARA
            transmit_command(LOAD)

        finally:
            hresult = SCardDisconnect(hcard, SCARD_UNPOWER_CARD)
            if hresult != SCARD_S_SUCCESS:
                raise error("Failed to disconnect: " + SCardGetErrorMessage(hresult))
            print("Disconnected")

    finally:
        hresult = SCardReleaseContext(hcontext)
        if hresult != SCARD_S_SUCCESS:
            raise error("Failed to release context: " + SCardGetErrorMessage(hresult))
        print("Released context.")
