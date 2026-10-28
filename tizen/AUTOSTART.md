# Optional Samsung TV autostart

`python3 tizen/build.py --generic --autostart --sign PROFILE` adds a TV-local Web Service that opens Free My TV on boot and on an observed standby-to-on transition. It talks only to the TV's own loopback interface. The ordinary build has no service and is unchanged.

The TV must support Web Services, and the signing profile must use a Samsung Partner distributor certificate bound to that TV: an ordinary public certificate can install the app but does not provide reliable `on-boot` execution. Tested on a 2019 UE65RU7099UXZG, Tizen 5, firmware T-MSLDEUC-1500.9. Other models and standby behavior need their own tests. On a full restart the service cannot start before the TV has started its own software.

An existing installation can only be updated in place with the same author certificate. If the author is different, the existing app must be removed before this build can be installed; removing it can delete its app data. Save and verify any settings before replacing it. Keep the author certificate for future updates, and never commit certificates, passwords, or device IDs.
