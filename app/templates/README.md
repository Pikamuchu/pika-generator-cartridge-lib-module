# Cartridge lib <%= module_name %>

[![Version](https://img.shields.io/npm/v/cartridge_lib_<%= module_name %>.svg)](https://npmjs.org/package/cartridge_lib_<%= module_name %>)
[![Build Status](https://img.shields.io/travis/<%= user %>/<%= repo %>/master.svg)](https://travis-ci.com/<%= user %>/<%= repo %>)
[![codecov](https://codecov.io/gh/<%= user %>/<%= repo %>/branch/master/graph/badge.svg)](https://codecov.io/gh/<%= user %>/<%= repo %>)

## Introduction

Cartridge library from [<%= module_name %>](https://www.npmjs.com/package/<%= module_name %>) npm  node module

## Build with

* [<%= module_name %>](https://www.npmjs.com/package/<%= module_name %>)

## Installation

This library can be installed as a standard SFRA cartridge cloning the repository

````
git clone git@github.com:<%= user %>/<%= repo %>.git
````

Or can be added to an existing SFRA cartridges project using

````
npm i cartridge_lib_<%= module_name %>
````

## Usage

This cartridge library is a babel transpilation to ES5 with some minor changes in order to be usable as a standard SFRA cartridge.

The main <%= module_name %> module can be loaded using as a standard SFRA script using

````
var <%= module_name %> = require('*/cartridge/scripts/lib/<%= module_name %>/index');
````

See [lodash](https://www.npmjs.com/package/lodash) documentation for module usage.
