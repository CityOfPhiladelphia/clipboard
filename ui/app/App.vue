<template>
  <div class="row">
    <div class="columns medium-4 phila-form-menu">
      <ul class="vertical menu">
        <li><a href="#">My Forms and Applications</a></li>
        <li><a href="#">My Payments</a></li>
      </ul>
    </div>

    <div class="columns medium-20">
      <phila-form :schema="facilityUse.schema" v-model="facilityUseModel" :formOptions="facilityUse.formOptions"></phila-form>
    </div>
  </div>
</template>

<script>
  import facilityUse from './testForms/facilityUse';

  export default {    
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