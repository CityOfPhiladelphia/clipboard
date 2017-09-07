<template>
  <div>
    <canvas class="signature-canvas" ref="signatureCanvas"></canvas>
    <div class="row">
      <div class="columns medium-9">
        <button v-on:click="clear" class="button full-width">
          <div class="valign">
            <div class="button-label valign-cell">Clear</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { abstractField } from 'vue-form-generator';
  import SignaturePad from 'signature_pad';

  export default {
    mixins: [ abstractField ],
    methods: {
      clear: function (e) {
        e.preventDefault();
        this.signaturePad.clear();
      }
    },
    mounted () {
      const canvas = this.$refs.signatureCanvas;
      this.signaturePad = new SignaturePad(canvas);

      function resizeCanvas() {
          // When zoomed out to less than 100%, for some very strange reason,
          // some browsers report devicePixelRatio as less than 1
          // and only part of the canvas is cleared then.
          var ratio =  Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);
      }

      window.onresize = resizeCanvas;
      resizeCanvas();
    },
    beforeDestroy () {
      this.signaturePad.off();
      window.onresize = null;
    }
  }
</script>

<style lang="css">
  .signature-canvas {
    width: 100%;
    height: 300px;
    border: 2px solid #444;
    cursor: pointer;
  }
</style>
