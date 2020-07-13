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
    this.cartridge_name = this.dirname.replace('cartridge_', '');
    this.dirnameNoJs = path.basename(this.dirname, '.js');
    this.dirnameWithJs = this.dirnameNoJs + '.js';
  },

  prompting: function() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Babel Library Boilerplate') + ' generator!'
    ));

    var gitName = this.user.git.name();
    var gitEmail = this.user.git.email();
    let defaultAuthor = gitName ? gitName : '';
    if (gitEmail) {
      defaultAuthor += ` <${gitEmail}>`;
    }

    var prompts = [{
      type: 'input',
      name: 'lib_module',
      message: 'What is the name of this project\'s node module?',
      default: this.cartridge_name
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

        // A good candidate for the module name is the directory, which we assume
        // to be derived from the repository name, stripped of any `.js` extension.
        // The extension is stripped per the "tips" section of the npm docs:
        // https://docs.npmjs.com/files/package.json#name
        self.moduleName = jsonEscape(self.dirnameNoJs.toLowerCase());

        // The mainFile, on the other hand, must always have an extension. Once
        // again we derive this from the name of the directory.
        self.fileName = jsonEscape(self.dirnameWithJs.toLowerCase());

        self.description = jsonEscape(props.description);
        self.author = jsonEscape(props.author);
        self.lib_module = props.lib_module;
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
      console.log('lib:' + self.lib_module);
      this.template('gitignore', '.gitignore');
      this.template('cartridges/lib_module', 'cartridges/lib_' + self.lib_module);
      this.template('cartridges/lib_module/.project', 'cartridges/lib_' + self.lib_module + '/.project');
      this.template('cartridges/module', 'cartridges/lib_' + self.lib_module + '/cartridge/scripts/lib/' + self.lib_module);
      this.template('cartridges/lib_module.properties', 'cartridges/lib_' + self.lib_module + '/lib_' + self.lib_module + '.properties');
    }
  },

  install: function() {
    this.installDependencies({
      bower: false,
      npm: true,
      skipInstall: this.options['skip-install']
    });
  }
});
