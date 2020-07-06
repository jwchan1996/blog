import Vue from 'vue'
import Lightimage from 'lightimage'

Vue.mixin({
  mounted() {
    if(this.$route.path.indexOf('/_posts/') > -1 && this.$route.path.indexOf('.html') > -1){
      this.$nextTick(() => {
        const imgs = document.querySelector('.theme-default-content').querySelectorAll('img')
        if(imgs.length != 0){    
          if(document.querySelector('.lightimage') == null){
            this.lightimage = new Lightimage('.theme-default-content').init({
              cursor: 'zoom-in',
              showAnimationDuration: '0.8s',
              maskLayerBindClose: true,
              maskLayerBgColor: 'rgba(0, 0, 0, 0.9)',
              showCloseBtn: true, 
              closeBtnHeight: 48,
              closeBtnWidth: 48,
              closeBtnColor: '#9c9c9c',
              closeBtnBgColor: 'rgba(0, 0, 0, 0)'
            })
          }
        }
      })
    }
  },
  destroyed(){
    const lightimages = document.querySelectorAll('.lightimage')
    for(let i=0; i<lightimages.length; i++){
      lightimages[i].parentNode.removeChild(lightimages[i])
    }
  }
})
