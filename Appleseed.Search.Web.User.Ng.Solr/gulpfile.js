var
  // modules
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  cssnano = require('gulp-cssnano'),
  htmlclean = require('gulp-htmlclean'),
  imagemin = require('gulp-imagemin'),
  jsonMinify = require('gulp-jsonminify'),
  maps = require('gulp-sourcemaps'),
  merge = require('gulp-merge'),
  newer = require('gulp-newer'),
  removeCode = require('gulp-remove-code'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  uglify = require('gulp-uglify'),

  // folders
  folder = {
    src: 'app/',
    dist: 'dist/drupal/module/docfinder/'
  },

  // config for concat/minify
  config = {
    jsonsrc: [
    ],
    ngsrc: [
      folder.src + "lib/angular/angular.js",
      folder.src + "lib/angular/angular-route.js",
      folder.src + "lib/angular/angular-sanitize.js"
    ],
    ngapp: [
      folder.src + "js/solr-ajax/app/document.js",
      folder.src + "js/solr-ajax/controllers/DateFacetController.js",
      folder.src + "js/solr-ajax/controllers/DateFacetHistogramController.js",
      folder.src + "js/solr-ajax/controllers/DateRangeFacetController.js",
      folder.src + "js/solr-ajax/controllers/DocumentSearchResultsController.js",
      folder.src + "js/solr-ajax/controllers/FacetSelectionController.js",
      folder.src + "js/solr-ajax/controllers/FacetClearSelectionController.js",
      folder.src + "js/solr-ajax/controllers/FieldFacetController.js",
      folder.src + "js/solr-ajax/controllers/FieldChosenFacetController.js",
      folder.src + "js/solr-ajax/controllers/FieldCheckboxFacetController.js",
      folder.src + "js/solr-ajax/controllers/FieldAlphaFilterFacetController.js",
      folder.src + "js/solr-ajax/controllers/SearchBoxController.js",
      folder.src + "js/solr-ajax/controllers/SearchHistoryController.js",
      folder.src + "js/solr-ajax/directives/autocomplete.js",
      folder.src + "js/solr-ajax/directives/searchbox.js",
      folder.src + "js/solr-ajax/directives/count-to.js",
      folder.src + "js/solr-ajax/filters/textfilters.js",
      folder.src + "js/solr-ajax/services/selection.js",
      folder.src + "js/solr-ajax/services/solr.js",
      folder.src + "js/solr-ajax/services/utils.js"
    ]
  };

  // Image processing
  gulp.task('images', function() {
    var out = folder.dist + 'img/';
    return gulp.src(folder.src + 'img/*')
      .pipe(newer(out))
      .pipe(imagemin({ optimizationLevel: 5 }))
      .pipe(gulp.dest(out));
  });

  // HTML processing
  gulp.task('html', ['images'], function() {
    var out = folder.dist;
    var main = gulp.src(folder.src + 'documents.html')
      .pipe(removeCode({ drupal: true }))
      .pipe(replace('{{siteDomainPath}}',''))
      .pipe(replace('<!doctype html>',''))
      .pipe(replace('img/no-doc.png', '/<?php echo drupal_get_path(\'module\', \'docfinder\'); ?>/img/no-doc.png'))
      .pipe(htmlclean())
      .pipe(rename('docfinder.tpl.php'))
      .pipe(gulp.dest(out));

    var box = gulp.src(folder.src + 'js/solr-ajax/directives/searchbox.html')
      .pipe(htmlclean())
      .pipe(gulp.dest(out));
    
    return merge(main, box);
  });

  // Chosen JS processing
  gulp.task('chosen', function() {
    var chosenCSS = gulp.src([folder.src + 'css/chosen/*'])
      .pipe(gulp.dest(folder.dist + '/css/chosen'));

    var chosenJS = gulp.src([folder.src + 'js/chosen/*'])
      .pipe(gulp.dest(folder.dist + '/js/chosen'));

    return merge(chosenCSS, chosenJS);
  });

  // CSS processing
  gulp.task('css', function() {

    return gulp.src(folder.src + 'css/fad.css')
      .pipe(replace("../../img", "../img"))
      .pipe(cssnano())
      .pipe(rename('docfinder.css'))
      .pipe(gulp.dest(folder.dist + 'css/'));
  });

  // Fonts processing
  gulp.task('fonts', function() {
    return gulp.src([folder.src + 'css/fontawesome/**/*'])
      .pipe(gulp.dest(folder.dist + '/fonts/fontawesome'));
  });

  // JSON processing
  gulp.task('json', function() {
    var jsonsrc =  gulp.src(config.jsonsrc)
      .pipe(jsonMinify())
      .pipe(gulp.dest(folder.dist + '/json'));
  });

  // Solr processing
  gulp.task('solr', function() {
    return gulp.src([folder.src + 'solr/*'])
      .pipe(gulp.dest(folder.dist + '/solr'));
  });

  // Scripts processing
  gulp.task('scripts', function() {
    var ngsrc =  gulp.src(config.ngsrc)
      .pipe(maps.init())
      .pipe(concat('angularCore.js'))
      .pipe(gulp.dest(folder.dist + '/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify({
        mangle: false
      }))
      .pipe(maps.write('maps'))
      .pipe(gulp.dest(folder.dist + '/js'));

    var ngapp = gulp.src(config.ngapp)
      .pipe(maps.init())
      .pipe(replace('"js/json/"', 'Drupal.settings.docfinder.module_folder + "/json/"'))
      .pipe(replace('"http://url.org"','Drupal.settings.docfinder.domain_path'))
      .pipe(replace('"stg.url.org"','Drupal.settings.docfinder.domain_alias'))
      .pipe(replace('"http://url.com/app', 'Drupal.settings.docfinder.module_folder + "'))
      .pipe(replace('"js/solr-ajax/directives/searchbox.html"', 'Drupal.settings.docfinder.module_folder + "/searchbox.html"'))
      .pipe(concat('app.js'))
      .pipe(gulp.dest(folder.dist + '/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify({
        mangle: false
      }))
      .pipe(maps.write('maps'))
      .pipe(gulp.dest(folder.dist + '/js'));

    return merge(ngsrc, ngapp);
  });

  // run all tasks
  gulp.task('default', ['html', 'css', 'scripts', 'fonts', 'json', 'chosen', 'solr']);

  // watch for changes
  gulp.task('watch', function() {

    // image changes
    gulp.watch(folder.src + 'img/**/*', ['images']);

    // html changes
    gulp.watch(folder.src + 'documents.html', ['html']);

    // javascript changes
    gulp.watch(folder.src + 'js/**/*', ['scripts']);

    // json changes
    gulp.watch(folder.src + 'js/json/*', ['json']);

    // css changes
    gulp.watch(folder.src + 'css/**/*', ['css']);

    // solr proxy changes
    gulp.watch(folder.src + 'solr/*', ['solr']);

  });
