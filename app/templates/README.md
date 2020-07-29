# Cartridge lib <%= module_name %>

[![Version](https://img.shields.io/npm/v/cartridge_lib_<%= module_name %>.svg)](https://npmjs.org/package/cartridge_lib_<%= module_name %>)
[![Build Status](https://travis-ci.com/<%= user %>/<%= repo %>.svg?branch=master)](https://travis-ci.com/<%= user %>/<%= repo %>)
[![codecov](https://codecov.io/gh/<%= user %>/<%= repo %>/branch/master/graph/badge.svg)](https://codecov.io/gh/<%= user %>/<%= repo %>)

## Introduction

Cartridge library from [<%= module_name %>](https://www.npmjs.com/package/<%= module_name %>) npm  node module version <%= module_version %>

## Build with

* [<%= module_name %>](https://www.npmjs.com/package/<%= module_name %>)
* [Generator Cartridge Lib Module](https://www.npmjs.com/package/generator-cartridge-lib-module)

## Installation

### As standard SFCC cartridge

This library can be installed as a standard SFRA cartridge cloning the repository and running npm script uploadCartridge

````
$ git clone git@github.com:<%= user %>/<%= repo %>.git
$ cd <%= repo %>
$ npm run uploadCartridge
````

### As npm library dependency on SFRA project

This library can be added to an existing SFRA project as npm library dependency using

````
$ npm i cartridge_lib_<%= module_name %>
````

This option is recommended for develop environments using [vscode](https://code.visualstudio.com/) + [Prophet Debugger](https://marketplace.visualstudio.com/items?itemName=SqrTT.prophet)

The Prophet Debugger Extension should be set with this configuration on user settings.json
````
"extension.prophet.upload.enabled": true,
"extension.prophet.ignore.list": ["\\.git", "\\.zip$"],
````

## Usage

This cartridge library is a babel transpilation to ES5 with some minor changes in order to be usable as a standard SFRA cartridge.

The <%= module_name %> module can be loaded using require cartridge as a standard SFRA script.

````
var <%= module_name %> = require('*/cartridge/scripts/lib/<%= module_name %>/index');
````

See [<%= module_name %>](https://www.npmjs.com/package/<%= module_name %>) documentation for module usage.
