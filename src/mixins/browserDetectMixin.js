export default {
  created() {
    window.addEventListener('popstate', () => {
      this.setDocumentTitle();
    });
    if (this.isWeiXinBrowser() || this.isQQBrowser()) {
      this.navTitle();
    }
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.setDocumentTitle);
  },
  methods: {
    setDocumentTitle() {
      if (this.isWeiXinBrowser() || this.isQQBrowser()) {
        this.navTitle();
      }
    },
    isWeiXinBrowser() {
      let ua = navigator.userAgent.toLowerCase();
      return ua.indexOf('micromessenger') !== -1;
    },
    isQQBrowser() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/QQ/i) === 'qq') {
        return true;
      } else {
        return false;
      }
    },
    navTitle() {
      this.$nextTick(() => {
        document.title = '';
      });
    },
  },
};
