shell = require('shelljs'),
    fs = require('fs'),
    _ = require('underscore');

console.show = function () {
    console.log(arguments);
    console.log('\n');
};

console.hide = function (args) {
    return null;
};

// @@TODO - remove _underscore for non-private functions!
/**
 * Git Library
 **/
module.exports = {
    /** 
     * When grabbing a repo, chaki should look at all the available remote branches and if a framework and/or version-specific branch is available clone that instead of master
     *
     * For example, if an app is touch 2.4.1.527, chaki would pick the first branch found of:
     *
     * touch/2.4.1.527
     * touch/2.4.1
     * touch/2.4
     * touch/2
     * touch
     * master
     */

     // this is not beautiful but it's tested and works
     getBestBranch : function (opts) {
        var senchaStuff = opts.senchaInfo,
            branches =  this.gitGetAllBranches({ dest : opts.dest }),
            frameworkVer = senchaStuff['app.framework.version'],
            framework = senchaStuff['app.framework'],
            frameworkVersionStack = frameworkVer.split('.').reverse(),
            path = framework + '/' + frameworkVer,
            b,
            winner,
            that = this;

        if (this._inBranch(branches, path)) {
            winner = path;
        } else {
            _.find(frameworkVersionStack, function (deg) {
                var l = (path.length - deg.length - 1);
                path = path.substring(0, l); 
                if (that._inBranch(branches, path)) {
                    console.show("winner 1", path);
                    winner = path;
                }
            });
        }

        if (winner) return winner;

        // check if there's a branch named as the framework
        if (this._inBranch(branches, framework)) {
            console.show('winner 2', framework);
            return framework;
        }

        // just return master
        console.show('winner 3', "master");
        return 'master';
    },

    // is the path in the branches array?
    _inBranch : function (branches, path) {
        console.log(branches, path);
        return branches.indexOf(path) >= 0;
    },

    gitGetAllBranches : function (opts) {
        console.show("GGA1", opts);
        var ran,
            out = [];

        shell.cd(opts.dest);
        ran = shell.exec("git for-each-ref --format='%(refname:short)'");
        console.log(ran.output.split('\n'));
        ran = ran.output.split('\n');

        _.each(ran, function (ref) {
            ref = ref.replace(/(\n|\r)+$/, '');
            ref = ref.replace('origin/', '');
            out.push(ref);
        });

        return out;
    },

    // checkout the required version of the package
    gitCheckoutBranch : function (opts) {
        var git1,
            git2;
            
        shell.cd(opts.path);
        git1 = shell.exec('git checkout -b ' + opts.branch);
        git2 = shell.exec('git pull origin ' + opts.branch);
        return ([git1, git2]);
    },

    gitCloneRepo : function (opts) {
         var code = (shell.exec('git clone ' + opts.path + ' ' + opts.dest).code); 
         console.show("GCR", code);
         return code;
    }
}