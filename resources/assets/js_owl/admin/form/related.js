const REMOVE_KEY = 'remove'

const defaults = {
  selector: '.grouped-elements',
  addButtonSelector: '.related-action_add',
  groupSelector: '.grouped-element',
  removeButtonSelector: '.related-action_remove',
}

class FormGroupEditor {
  name = ''
  created = 0
  $el = null
  $addButton = null
  selector = null
  limit = null
  $template = null

  constructor(selector = '.grouped-elements') {
    this.selector = selector
    this.$el = $(selector)
    this.name = this.$el.data('name')
    this.limit = this.$el.data('limit')
    this.$addButton = this.$el.find(defaults.addButtonSelector)
    this.$template = this.getTemplate()
    this.created = this.$el.data('new-count')
  }

  init() {
    this.__initHandlers()
    this.checkLimit()
  }

  __initHandlers() {
    this.$addButton.on('click', () => {
      if (this.outOfLimit()) {
        return false
      }

      this.appendTemplate()

      this.checkLimit()
    })

    this.$el.on('click', defaults.removeButtonSelector, e => {
      const $this = $(e.currentTarget)
      const $group = $this.parents(defaults.groupSelector)
      const id = $group.data('pk')

      $group.remove()
      this.addRemoveInput(id)

      this.checkLimit()
    })
  }

  checkLimit() {
    if (this.outOfLimit()) {
      this.$addButton.hide()
    } else {
      this.$addButton.show()
    }
  }

  outOfLimit() {
    if (this.limit === undefined) {
      return false
    }

    return this.getGroupsCount() >= this.limit
  }

  getGroupsCount() {
    return this.getGroups().length
  }

  getGroups() {
    return this.$el.find(defaults.groupSelector)
  }

  appendTemplate() {
    this.created++
    const $template = this.getTemplate()
    $template.attr('id', `template-created-${this.created}`)
    $template.insertBefore(this.$addButton)
    new Vue({ el: `#template-created-${this.created}` })
    $(`#template-created-${this.created}`).find('input, select').each((x, input) => {
      const $input = $(input)
      this.generateName($input, `new_${this.created}`)
    })
  }

  getTemplate() {
    // Get all inputs
    return $($(`#${this.name}_template`).clone().html())
  }

  addRemoveInput(id) {
    if (!id) {
      return
    }

    this.$el.append(`<input type='hidden' name='${this.name}[${REMOVE_KEY}][]' value='${id}'>`)
  }

  generateName($input, key) {
    $input.attr('name', `${this.name}[${key}][${$input.attr('name')}]`)
  }
}

Admin.Modules.register('related-form', () => {
  $('.grouped-elements').each((x, el) => {
    (new FormGroupEditor($(el))).init()
  })
}, 0, ['bootstrap::tab::shown'])
