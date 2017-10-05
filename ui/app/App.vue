<template>
  <div class="row">
    <div class="columns medium-4 phila-form-menu">
      <ul class="vertical menu">
        <li><a href="#">My Forms and Applications</a></li>
        <li><a href="#">My Payments</a></li>
      </ul>
    </div>

    <div class="columns medium-20">
      <clipboard-form :schema="facilityUse.schema" :data="facilityUseModel"></clipboard-form>
    </div>
  </div>
</template>

<script>
  import ClipboardForm from './components/ClipboardForm.vue'

  import facilityUse from './testForms/facilityUse2'

  export default {
    components: {
      ClipboardForm
    },

    data () {
      return {
        facilityUse: facilityUse,
        facilityUseModel: {}
      }
    }
  }

</script>

<style lang="css">
  .phila-form-menu {
    margin-top: 50px;
  }
</style>