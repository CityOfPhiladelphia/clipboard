<script>
  import { component } from 'vue-form-generator';

  // TODO: minutes !!!
  // TODO: use native picker on mobile

  export default {
    mixins: [ component.components.fieldSelect ],
    computed: {
      items() {
        var times = [];
        for (var k=0; k<2; k++) {
          var hourblock = ' AM';
          if (k == 1)
            hourblock = ' PM';
          for (var i=1; i<=12; i++) {
            times.push(i + hourblock);
          }
        }
        return times;
      }
    }
  }
</script>
