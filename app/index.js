'use strict';
var file = require('file');
var path = require('path');
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var jsesc = require('jsesc');

function jsonEscape(str) {
  return jsesc(str, {quotes: 'double'});
}

module.exports = generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
    this.username = 'anonymous';
    this.dirname = path.basename(this.destinationRoot());
    this.dirnameNoJs = path.basename(this.dirname, '.js');
    this.dirnameWithJs = this.dirnameNoJs + '.js';
    this.defaultModuleName = this.dirname.replace(/cartridge[_-]?/, '').replace(/(library|lib)[_-]?/, '');
    this.defaultModuleVersion = '^1.0.0';
    this.defaultModuleType = 'lib';
  },

  prompting: function() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Cartridge Lib Module') + ' generator!'
    ));

    var gitName = this.user.git.name();
    var gitEmail = this.user.git.email();
    let defaultAuthor = gitName ? gitName : '';
    if (gitEmail) {
      defaultAuthor += ` <${gitEmail}>`;
    }

    var prompts = [{
      type: 'input',
      name: 'module_name',
      message: 'What is the name of this library module?',
      default: this.defaultModuleName
    }, {
      type: 'input',
      name: 'module_version',
      message: 'What is the version of the node module dependency?',
      default: this.defaultModuleVersion
    },{
      type: 'input',
      name: 'module_type',
      message: 'What is the main folder of the node module dependency on package.json (lib, dist, ...)?',
      default: this.defaultModuleType
    }, {
      type: 'input',
      name: 'user',
      message: 'What is the Github username/organization for this project?',
      default: this.username,
      store: true
    }, {
      type: 'input',
      name: 'repo',
      message: 'What is the repository/project name?',
      // This default works when the directory was generated from a cloned
      // repository, or when the user intends to make a repo with the same
      // name as the directory. We assume this is the most common situation.
      default: this.dirname
    }, {
      type: 'input',
      name: 'description',
      message: 'What is a short description for this project?'
    }, {
      type: 'input',
      name: 'author',
      message: 'Who is the author of this project?',
      default: defaultAuthor,
      store: true
    }];

    var self = this;
    return self.prompt(prompts)
      .then(function(props) {
        self.user = jsonEscape(props.user);
        self.repo = jsonEscape(props.repo);
        self.description = jsonEscape(props.description);
        self.author = jsonEscape(props.author);
        self.module_name = props.module_name;
        self.module_version = props.module_version;
        self.module_type = props.module_type;
      });
  },

  writing: {
    app: function() {
      var src = this.sourceRoot();
      var self = this;
      file.walkSync(src, function(dirPath, dirs, files) {
        var relativeDir = path.relative(src, dirPath);
        files.forEach(function(filename) {
          var target;
          // Only copy the files that we don't want to rename. We do that after this loop.
          var ignoreDir = relativeDir.match('cartridges');
          var ignoreFile = /gitignore$/.test(filename);
          var shouldCopy = !ignoreDir && !ignoreFile;
          if (shouldCopy) {
            target = path.join(relativeDir, filename);
            self.template(target, target);
          }
        });
      });
      console.log('lib:' + self.module_name);
      this.template('gitignore', '.gitignore');
      this.template('cartridges/lib_module', 'cartridges/lib_' + self.module_name);
      this.template('cartridges/lib_module/.project', 'cartridges/lib_' + self.module_name + '/.project');
      this.template('cartridges/module', 'cartridges/lib_' + self.module_name + '/cartridge/scripts/lib/' + self.module_name);
      this.template('cartridges/lib_module.properties', 'cartridges/lib_' + self.module_name + '/cartridge/lib_' + self.module_name + '.properties');
    }
  },

  install: function() {
    var installConfig = {
      bower: false,
      npm: true,
      skipInstall: this.options['skip-install']
    }
    if (!installConfig.skipInstall) {
      installConfig.callback = function () {
        this.spawnCommand('npm', ['run', 'build']);
      }.bind(this) // bind the callback to the parent scope
    }
    this.installDependencies(installConfig);
  }
});
