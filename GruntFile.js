module.exports = function(grunt){
  options = {
    connect:{
      all:{
        options:{
          port: 1337,
          hostname: "127.0.0.1",
          livereload:true
        }
      }
    },
    watch:{
      source:{
        files: ['./examples/src/**/*.js'],
        tasks: ['browserify:examples']
      },
      options:{
        livereload:true
      }
    },
    browserify:{
      examples:{
        files:{
          "./examples/js/bundle.js" : ['./examples/src/app.js']
        },
      },
      build:{
        files:{
          "./build/kettle.tween.js" : ['./kettle-tween.js']
        }
      }
    },
    open:{
      all:{
        path:'http://127.0.0.1:1337/examples/simple_tween.html'
      }
    }
  };

  grunt.initConfig(options);
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-open");

  grunt.registerTask("default", ["browserify:build"])
  grunt.registerTask("examples", ["browserify:examples", "connect","open","watch:source"]);
}
