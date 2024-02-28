"use strict";
(self["webpackChunknoticias"] = self["webpackChunknoticias"] || []).push([["news"],{

/***/ "./resources/js/news.js":
/*!******************************!*\
  !*** ./resources/js/news.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/time */ "./resources/js/utils/time.js");
/* harmony import */ var _css_app_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/app.css */ "./resources/css/app.css");


const noop = () => {};
const audio = document.querySelector('audio');
const indexFilter = (a, b) => a.dataset.index - b.dataset.index;
const commonPostsPanel = Array.from(document.querySelector('[data-js="common-posts-panel"]').children).sort(indexFilter);
const sessionPostsPanel = Array.from(document.querySelector('[data-js="session-posts-panel"]').children).sort(indexFilter);
let isPlaying = false;
const hide = el => {
  if (el.tagName === 'VIDEO') {
    el.onplay = noop;
    el.onpause = noop;
    el.pause();
    el.currentTime = 0;
  }
  el.classList.add('hidden');
};
const changePost = gen => {
  const next = gen.next();
  if (next.done) return;
  const el = next.value;
  if (el.tagName === 'VIDEO') {
    if (!el.muted && isPlaying) {
      changePost(gen);
      return;
    }
    el.onplay = () => {
      if (!isPlaying) {
        audio.muted = !el.muted;
        isPlaying = !el.muted;
      }
    };
    el.onpause = () => {
      if (!el.muted) {
        audio.muted = false;
        isPlaying = false;
      }
      hide(el);
      changePost(gen);
    };
    el.play();
  } else {
    setTimeout(() => {
      hide(el);
      changePost(gen);
    }, 10_000);
  }
  el.classList.remove('hidden');
};
const incrementIndex = (index, max) => index + 1 < max ? index + 1 : 0;
function nextItemWithPriority(normalPriority, highPriority, each) {
  let {
    normal,
    high
  } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    normal: 0,
    high: 0
  };
  return function* () {
    if (normalPriority.length === 0) return;
    let normalPriorityYieldedCount = 0;
    let normalPriorityIndex = normal;
    let highPriorityIndex = high;
    while (true) {
      if (normalPriorityYieldedCount >= each && highPriority.length > 0) {
        normalPriorityYieldedCount = 0;
        yield highPriority[highPriorityIndex];
        highPriorityIndex = incrementIndex(highPriorityIndex, highPriority.length);
      } else {
        normalPriorityYieldedCount++;
        yield normalPriority[normalPriorityIndex];
        normalPriorityIndex = incrementIndex(normalPriorityIndex, normalPriority.length);
      }
    }
  }();
}
const noPriorityFilter = el => !Number(el.dataset.priority);
const priorityFilter = el => !!Number(el.dataset.priority);
const separatePriorities = els => [els.filter(noPriorityFilter), els.filter(priorityFilter)];
const [commonNormal, commonHigh] = separatePriorities(commonPostsPanel);
const [sessionNormal, sessionHigh] = separatePriorities(sessionPostsPanel);
const commonGen = nextItemWithPriority(commonNormal, commonHigh, commonNormal.length > commonHigh.length ? 3 : 1);
const sessionGen = nextItemWithPriority(sessionNormal, sessionHigh, sessionNormal.length > sessionHigh.length ? 3 : 1);
changePost(commonGen);
changePost(sessionGen);
setTimeout(() => {
  location.reload();
}, (0,_utils_time__WEBPACK_IMPORTED_MODULE_0__.getNextRestartMillis)());

/***/ }),

/***/ "./resources/js/utils/time.js":
/*!************************************!*\
  !*** ./resources/js/utils/time.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getNextRestartMillis": function() { return /* binding */ getNextRestartMillis; }
/* harmony export */ });
/* harmony import */ var luxon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! luxon */ "./node_modules/luxon/src/luxon.js");

function getNextRestartMillis() {
  const now = luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.now();
  const hourNow = now.hour;
  if (hourNow < 6) return getDifference(now, 6);
  if (hourNow < 12) return getDifference(now, 12);
  if (hourNow < 18) return getDifference(now, 18);
  return getDifference(now, 6, true);
}
function getDifference(now, hour) {
  let isNewDay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const future = luxon__WEBPACK_IMPORTED_MODULE_0__.DateTime.now().set({
    hour,
    minute: 5,
    ...(isNewDay && {
      day: now.day + 1
    })
  });
  return future.diff(now, 'milliseconds').milliseconds;
}

/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["vendors-node_modules_luxon_src_luxon_js","resources_css_app_css"], function() { return __webpack_exec__("./resources/js/news.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsRUFBRSxDQUFDO0VBQy9DLElBQUlDLE9BQU8sR0FBRyxFQUFFLEVBQUUsT0FBT0UsYUFBYSxDQUFDSCxHQUFHLEVBQUUsRUFBRSxDQUFDO0VBQy9DLE9BQU9HLGFBQWEsQ0FBQ0gsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7QUFDcEM7QUFFQSxTQUFTRyxhQUFhQSxDQUFDSCxHQUFHLEVBQUVFLElBQUksRUFBb0I7RUFBQSxJQUFsQkUsUUFBUSxHQUFBMUIsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsS0FBSztFQUNoRCxNQUFNMkIsTUFBTSxHQUFHTiwrQ0FBWSxDQUFDLENBQUMsQ0FBQ08sR0FBRyxDQUFDO0lBQUVKLElBQUk7SUFBRUssTUFBTSxFQUFFLENBQUM7SUFBRSxJQUFJSCxRQUFRLElBQUk7TUFBRUksR0FBRyxFQUFFUixHQUFHLENBQUNRLEdBQUcsR0FBRztJQUFFLENBQUM7RUFBRSxDQUFDLENBQUM7RUFFN0YsT0FBT0gsTUFBTSxDQUFDSSxJQUFJLENBQUNULEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQ1UsWUFBWTtBQUN0RDs7Ozs7Ozs7Ozs7QUNoQkEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ub3RpY2lhcy8uL3Jlc291cmNlcy9qcy9uZXdzLmpzIiwid2VicGFjazovL25vdGljaWFzLy4vcmVzb3VyY2VzL2pzL3V0aWxzL3RpbWUuanMiLCJ3ZWJwYWNrOi8vbm90aWNpYXMvLi9yZXNvdXJjZXMvY3NzL2FwcC5jc3M/NTMwNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXROZXh0UmVzdGFydE1pbGxpcyB9IGZyb20gJy4vdXRpbHMvdGltZSdcclxuXHJcbmltcG9ydCAnLi4vY3NzL2FwcC5jc3MnXHJcblxyXG5jb25zdCBub29wID0gKCkgPT4ge31cclxuXHJcbmNvbnN0IGF1ZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXVkaW8nKVxyXG5cclxuY29uc3QgaW5kZXhGaWx0ZXIgPSAoYSwgYikgPT4gYS5kYXRhc2V0LmluZGV4IC0gYi5kYXRhc2V0LmluZGV4XHJcbmNvbnN0IGNvbW1vblBvc3RzUGFuZWwgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWpzPVwiY29tbW9uLXBvc3RzLXBhbmVsXCJdJykuY2hpbGRyZW4pLnNvcnQoaW5kZXhGaWx0ZXIpXHJcbmNvbnN0IHNlc3Npb25Qb3N0c1BhbmVsID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1qcz1cInNlc3Npb24tcG9zdHMtcGFuZWxcIl0nKS5jaGlsZHJlbikuc29ydChcclxuICBpbmRleEZpbHRlcixcclxuKVxyXG5cclxubGV0IGlzUGxheWluZyA9IGZhbHNlXHJcblxyXG5jb25zdCBoaWRlID0gZWwgPT4ge1xyXG4gIGlmIChlbC50YWdOYW1lID09PSAnVklERU8nKSB7XHJcbiAgICBlbC5vbnBsYXkgPSBub29wXHJcbiAgICBlbC5vbnBhdXNlID0gbm9vcFxyXG4gICAgZWwucGF1c2UoKVxyXG4gICAgZWwuY3VycmVudFRpbWUgPSAwXHJcbiAgfVxyXG5cclxuICBlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG59XHJcblxyXG5jb25zdCBjaGFuZ2VQb3N0ID0gZ2VuID0+IHtcclxuICBjb25zdCBuZXh0ID0gZ2VuLm5leHQoKVxyXG5cclxuICBpZiAobmV4dC5kb25lKSByZXR1cm5cclxuXHJcbiAgY29uc3QgZWwgPSBuZXh0LnZhbHVlXHJcblxyXG4gIGlmIChlbC50YWdOYW1lID09PSAnVklERU8nKSB7XHJcbiAgICBpZiAoIWVsLm11dGVkICYmIGlzUGxheWluZykge1xyXG4gICAgICBjaGFuZ2VQb3N0KGdlbilcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgZWwub25wbGF5ID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIWlzUGxheWluZykge1xyXG4gICAgICAgIGF1ZGlvLm11dGVkID0gIWVsLm11dGVkXHJcbiAgICAgICAgaXNQbGF5aW5nID0gIWVsLm11dGVkXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbC5vbnBhdXNlID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIWVsLm11dGVkKSB7XHJcbiAgICAgICAgYXVkaW8ubXV0ZWQgPSBmYWxzZVxyXG4gICAgICAgIGlzUGxheWluZyA9IGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgaGlkZShlbClcclxuICAgICAgY2hhbmdlUG9zdChnZW4pXHJcbiAgICB9XHJcblxyXG4gICAgZWwucGxheSgpXHJcbiAgfSBlbHNlIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBoaWRlKGVsKVxyXG4gICAgICBjaGFuZ2VQb3N0KGdlbilcclxuICAgIH0sIDEwXzAwMClcclxuICB9XHJcblxyXG4gIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXHJcbn1cclxuXHJcbmNvbnN0IGluY3JlbWVudEluZGV4ID0gKGluZGV4LCBtYXgpID0+IChpbmRleCArIDEgPCBtYXggPyBpbmRleCArIDEgOiAwKVxyXG5cclxuZnVuY3Rpb24qIG5leHRJdGVtV2l0aFByaW9yaXR5KG5vcm1hbFByaW9yaXR5LCBoaWdoUHJpb3JpdHksIGVhY2gsIHsgbm9ybWFsLCBoaWdoIH0gPSB7IG5vcm1hbDogMCwgaGlnaDogMCB9KSB7XHJcbiAgaWYgKG5vcm1hbFByaW9yaXR5Lmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gIGxldCBub3JtYWxQcmlvcml0eVlpZWxkZWRDb3VudCA9IDBcclxuICBsZXQgbm9ybWFsUHJpb3JpdHlJbmRleCA9IG5vcm1hbFxyXG4gIGxldCBoaWdoUHJpb3JpdHlJbmRleCA9IGhpZ2hcclxuXHJcbiAgd2hpbGUgKHRydWUpIHtcclxuICAgIGlmIChub3JtYWxQcmlvcml0eVlpZWxkZWRDb3VudCA+PSBlYWNoICYmIGhpZ2hQcmlvcml0eS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIG5vcm1hbFByaW9yaXR5WWllbGRlZENvdW50ID0gMFxyXG4gICAgICB5aWVsZCBoaWdoUHJpb3JpdHlbaGlnaFByaW9yaXR5SW5kZXhdXHJcbiAgICAgIGhpZ2hQcmlvcml0eUluZGV4ID0gaW5jcmVtZW50SW5kZXgoaGlnaFByaW9yaXR5SW5kZXgsIGhpZ2hQcmlvcml0eS5sZW5ndGgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub3JtYWxQcmlvcml0eVlpZWxkZWRDb3VudCsrXHJcbiAgICAgIHlpZWxkIG5vcm1hbFByaW9yaXR5W25vcm1hbFByaW9yaXR5SW5kZXhdXHJcbiAgICAgIG5vcm1hbFByaW9yaXR5SW5kZXggPSBpbmNyZW1lbnRJbmRleChub3JtYWxQcmlvcml0eUluZGV4LCBub3JtYWxQcmlvcml0eS5sZW5ndGgpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBub1ByaW9yaXR5RmlsdGVyID0gZWwgPT4gIU51bWJlcihlbC5kYXRhc2V0LnByaW9yaXR5KVxyXG5jb25zdCBwcmlvcml0eUZpbHRlciA9IGVsID0+ICEhTnVtYmVyKGVsLmRhdGFzZXQucHJpb3JpdHkpXHJcbmNvbnN0IHNlcGFyYXRlUHJpb3JpdGllcyA9IGVscyA9PiBbZWxzLmZpbHRlcihub1ByaW9yaXR5RmlsdGVyKSwgZWxzLmZpbHRlcihwcmlvcml0eUZpbHRlcildXHJcblxyXG5jb25zdCBbY29tbW9uTm9ybWFsLCBjb21tb25IaWdoXSA9IHNlcGFyYXRlUHJpb3JpdGllcyhjb21tb25Qb3N0c1BhbmVsKVxyXG5jb25zdCBbc2Vzc2lvbk5vcm1hbCwgc2Vzc2lvbkhpZ2hdID0gc2VwYXJhdGVQcmlvcml0aWVzKHNlc3Npb25Qb3N0c1BhbmVsKVxyXG5cclxuY29uc3QgY29tbW9uR2VuID0gbmV4dEl0ZW1XaXRoUHJpb3JpdHkoY29tbW9uTm9ybWFsLCBjb21tb25IaWdoLCBjb21tb25Ob3JtYWwubGVuZ3RoID4gY29tbW9uSGlnaC5sZW5ndGggPyAzIDogMSlcclxuY29uc3Qgc2Vzc2lvbkdlbiA9IG5leHRJdGVtV2l0aFByaW9yaXR5KHNlc3Npb25Ob3JtYWwsIHNlc3Npb25IaWdoLCBzZXNzaW9uTm9ybWFsLmxlbmd0aCA+IHNlc3Npb25IaWdoLmxlbmd0aCA/IDMgOiAxKVxyXG5cclxuY2hhbmdlUG9zdChjb21tb25HZW4pXHJcbmNoYW5nZVBvc3Qoc2Vzc2lvbkdlbilcclxuXHJcbnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gIGxvY2F0aW9uLnJlbG9hZCgpXHJcbn0sIGdldE5leHRSZXN0YXJ0TWlsbGlzKCkpXHJcbiIsImltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSAnbHV4b24nXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dFJlc3RhcnRNaWxsaXMoKSB7XHJcbiAgY29uc3Qgbm93ID0gRGF0ZVRpbWUubm93KClcclxuICBjb25zdCBob3VyTm93ID0gbm93LmhvdXJcclxuXHJcbiAgaWYgKGhvdXJOb3cgPCA2KSByZXR1cm4gZ2V0RGlmZmVyZW5jZShub3csIDYpXHJcbiAgaWYgKGhvdXJOb3cgPCAxMikgcmV0dXJuIGdldERpZmZlcmVuY2Uobm93LCAxMilcclxuICBpZiAoaG91ck5vdyA8IDE4KSByZXR1cm4gZ2V0RGlmZmVyZW5jZShub3csIDE4KVxyXG4gIHJldHVybiBnZXREaWZmZXJlbmNlKG5vdywgNiwgdHJ1ZSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGlmZmVyZW5jZShub3csIGhvdXIsIGlzTmV3RGF5ID0gZmFsc2UpIHtcclxuICBjb25zdCBmdXR1cmUgPSBEYXRlVGltZS5ub3coKS5zZXQoeyBob3VyLCBtaW51dGU6IDUsIC4uLihpc05ld0RheSAmJiB7IGRheTogbm93LmRheSArIDEgfSkgfSlcclxuXHJcbiAgcmV0dXJuIGZ1dHVyZS5kaWZmKG5vdywgJ21pbGxpc2Vjb25kcycpLm1pbGxpc2Vjb25kc1xyXG59XHJcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6WyJnZXROZXh0UmVzdGFydE1pbGxpcyIsIm5vb3AiLCJhdWRpbyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImluZGV4RmlsdGVyIiwiYSIsImIiLCJkYXRhc2V0IiwiaW5kZXgiLCJjb21tb25Qb3N0c1BhbmVsIiwiQXJyYXkiLCJmcm9tIiwiY2hpbGRyZW4iLCJzb3J0Iiwic2Vzc2lvblBvc3RzUGFuZWwiLCJpc1BsYXlpbmciLCJoaWRlIiwiZWwiLCJ0YWdOYW1lIiwib25wbGF5Iiwib25wYXVzZSIsInBhdXNlIiwiY3VycmVudFRpbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJjaGFuZ2VQb3N0IiwiZ2VuIiwibmV4dCIsImRvbmUiLCJ2YWx1ZSIsIm11dGVkIiwicGxheSIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJpbmNyZW1lbnRJbmRleCIsIm1heCIsIm5leHRJdGVtV2l0aFByaW9yaXR5Iiwibm9ybWFsUHJpb3JpdHkiLCJoaWdoUHJpb3JpdHkiLCJlYWNoIiwibm9ybWFsIiwiaGlnaCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIm5vcm1hbFByaW9yaXR5WWllbGRlZENvdW50Iiwibm9ybWFsUHJpb3JpdHlJbmRleCIsImhpZ2hQcmlvcml0eUluZGV4Iiwibm9Qcmlvcml0eUZpbHRlciIsIk51bWJlciIsInByaW9yaXR5IiwicHJpb3JpdHlGaWx0ZXIiLCJzZXBhcmF0ZVByaW9yaXRpZXMiLCJlbHMiLCJmaWx0ZXIiLCJjb21tb25Ob3JtYWwiLCJjb21tb25IaWdoIiwic2Vzc2lvbk5vcm1hbCIsInNlc3Npb25IaWdoIiwiY29tbW9uR2VuIiwic2Vzc2lvbkdlbiIsImxvY2F0aW9uIiwicmVsb2FkIiwiRGF0ZVRpbWUiLCJub3ciLCJob3VyTm93IiwiaG91ciIsImdldERpZmZlcmVuY2UiLCJpc05ld0RheSIsImZ1dHVyZSIsInNldCIsIm1pbnV0ZSIsImRheSIsImRpZmYiLCJtaWxsaXNlY29uZHMiXSwic291cmNlUm9vdCI6IiJ9