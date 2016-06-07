module.exports = function(grunt) {

grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),

concat: {
  options: {
    // define a string to put between each file in the concatenated output
    separator: ';'
  },
  dist: {
    // the files to concatenate
    src: ['*.js'],
    // the location of the resulting JS file
    dest: 'dist/<%= pkg.name %>.js'
  }
},

uglify: {
  options: {
    // the banner is inserted at the top of the output
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
  },
  dist: {
    files: {
      'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
    }
  }
},
 connect: {
    server: {
      options: {
        port: 9001,
	keepalive:true
      }
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.registerTask('default', ['concat', 'uglify']);

};