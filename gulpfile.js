var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify  = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var autoprefixer = require('gulp-autoprefixer');
var rigger = require('gulp-rigger');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var cssbeautify = require('gulp-cssbeautify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');

//-----------------------------------path----------------------------//
var  path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/html',
        css: 'build/css',
        image: 'build/img',
        js: 'build/js'
    },
    src: { //Пути откуда брать исходники
        html: 'src/html/*.html',
        scss: 'src/scss/*.scss',
        image: 'src/img/*',
        js: 'src/js/*.js'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/html/**',
        scss: 'src/scss/**',
        js: 'src/js/**'
    },
    clean: './build'
};
// server connect
gulp.task('connect', function() {
  connect.server({
    host: '127.0.0.1',
    port: 9999,
    root: 'build',
    livereload: true
  });
});

//-----------------------------------image task----------------------------//
// gulp.task('compress', function() {
//   gulp.src(path.src.image)
//   .pipe(imagemin())
//   .pipe(gulp.dest(path.build.image))
// });

//-----------------------------------html task----------------------------//
gulp.task('html', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(connect.reload())
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
});

//-----------------------------------SCSS to CSS----------------------------//
gulp.task('sass', function () {
  return gulp.src(path.src.scss)
    .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: false }))
    .pipe(cssbeautify())
    .pipe(sourcemaps.init())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(connect.reload())
    .pipe(gulp.dest(path.build.css));
});

// gulp.task('sprite', function() {
//     var spriteData =
//         gulp.src('src/images/sprite/*.*') // путь, откуда берем картинки для спрайта
//             .pipe(spritesmith({
//                 imgName: 'sprite.png',
//                 cssName: 'sprite.css',
//                 algorithm: 'binary-tree',
//             }));

//     spriteData.img.pipe(gulp.dest('build/images/sprite')); // путь, куда сохраняем картинку
//     spriteData.css.pipe(gulp.dest('build/css/')); // путь, куда сохраняем стили
// });

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        // 'src/js/jquery.js',
        'src/js/jquery.js',
        'src/js/main.js',
        ])
        .pipe(concat('main.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('build/js')); // Выгружаем в папку app/js
        // .pipe(gulp.dest(path.build.js));
});

//-----------------------------------watch task----------------------------//
gulp.task('sass:watch', function () {
  gulp.watch(path.watch.scss, ['sass']);
});
gulp.task('html:watch', function () {
  gulp.watch(path.watch.html, ['html']);
});
// gulp.task('image:watch', function() {
//   gulp.watch(path.src.image, ['compress']);
// });
gulp.task('scripts:watch', function() {
  gulp.watch(path.src.js, ['scripts']);
});

//-----------------------------------default task----------------------------//
gulp.task('default', ['connect', 'html', 'sass', 'scripts', 'sass:watch', 'html:watch', 'scripts:watch']);
