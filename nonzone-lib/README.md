# nonzone-lib

This library contains some common code for _app_ and _webapp_ modules.

It has 2 implementations of saving/loading data - using _arweave_ and _firebase_.

The common logic is in _index.js_ and files included in it. It's mostly different hooks and saving functions.

_io.js_ points to the right integration - it's set in root _package.json_ scripts for different types of build and it can be switched manually by editing the file for development.
