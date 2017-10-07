<template>
  <span>{{ message }}</span>
</template>

<script>
  import Mustache from 'Mustache'

  const defaultValidationMessages = {
    required: '{{label}} is required',
    minLength: '{{label}} needs to be at least {{$params.minLength.min}} characters',
    maxLength: '{{label}} cannot be more than {{$params.minLength.max}} characters',
    email: '{{label}} needs to be a valid email address',
    notDisposableEmail: '{{label}} cannot be a disposable email address'
  }

  const getValue = (obj, path) => {
    let curr = obj
    for (let i = 0, ln = path.length; i < ln; i++) {
      let k = path[i]
      if (k in curr)
        curr = curr[k]
      else
        return
    }
    return curr
  }

  export default {
    name: 'phila-form-error-message',

    props: {
      field: {
        type: String
      },
      fieldPath: {
        type: [Array, String]
      },
      label: {
        type: String
      },
      validationMessages: {
        type: Object
      }
    },

    computed: {
      message () {
        var $v = null, vnode = this
        for (var i = 0; i < 4; i++) {
          if ('$v' in vnode) {
            $v = vnode.$v
            break
          } else {
            vnode = vnode.$parent
          }
        }

        let $localV
        if (this.fieldPath) {
          let fieldPath
          if (Array.isArray(this.fieldPath))
            fieldPath = this.fieldPath
          else
            fieldPath = this.fieldPath.split('.')
          $localV = getValue($v, this.fieldPath)
        } else
          $localV = $v[this.field]

        const messages = Object.assign(
          {},
          defaultValidationMessages,
          this.validationMessages || {})
        const params = {
          $params: $localV.$params,
          field: this.field,
          label: this.label || this.field
        }

        for (var errorType in messages) {
          if ($localV[errorType] === false)
            return Mustache.render(messages[errorType], params)
        }

        return (this.label || this.field) + ' is invalid' // failover is validation message is not defined
      }
    }
  }
</script>
