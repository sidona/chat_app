/**
 * Created by sdonose on 10/19/2015.
 */
module.exports=function(grunt){
  grunt.initConfig({
    nodemon:{
      all:{
        script:"server.js",
        options:{
          watchedExtensions:['js']
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.registerTask('default',['nodemon']);
};