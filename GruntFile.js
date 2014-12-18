module.exports = function(grunt){
  options = {
    watch:{
      source:{
        files: ['./examples/src/**/*.js'],
        tasks: ['browserify:dist']
      },
      options:{
        livereload:true
      }
    },
    browserify:{
      dist:{
        files:{
          "./examples/js/bundle.js" : ['./examples/src/app.js']
        }
      }
    }
  };

  grunt.initConfig(options);
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["browserify:dist", "watch:source"]);
  
}
