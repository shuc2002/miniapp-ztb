declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
/**
 * 告诉 window是个全局对象，直接可用，这样就不会在window.xx = 123时报错
 */
// declare var window: any;
/**
 * UI模块 uview
 */
/**
 * UI模块 uview
 */
declare const uni: any;
declare const module;

declare module 'uview-ui';
