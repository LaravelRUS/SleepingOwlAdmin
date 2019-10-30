Admin.Modules.register('storage.tabbed', () => {
  const stateTabs = Admin.Config.get('state_tabs')

  if (stateTabs) {
    var tabbed = document.getElementsByClassName('nav-tabs')

    //Check if have tabs
    if (tabbed.length > 0) {
      url = getName()

      //Check in localStorage
      if (localStorage.getItem(url)) {
        activeTabs = localStorage.getItem(url)
        setActiveTabs(activeTabs)
      }
    }
  }


  //Events

  $('a[data-toggle="tab"]')
    .on('shown.bs.tab', function (e) {
      let tab = $(e.target).attr('aria-controls')
      Admin.Events.fire('bootstrap::tab::shown', tab)

      if (stateTabs) {
        fillActiveTabs(url, tabbed)
      }
      jQuery('[data-toggle="tooltip"]').tooltip()
    })
    .on('hidden.bs.tab', function (e) {
      let tab = $(e.target).attr('aria-controls')
      Admin.Events.fire('bootstrap::tab::hidden', tab)
    })


  // ==========================
  //Get localStorage name
  function getName() {
    var path = window.location.pathname

    //Simplify name for edit
    var isEdit = path.search('edit') > 0;
    if (isEdit) {
      path = path.replace(/\d+\/edit$/, '') + 'edit'
    }

    var url = 'Tabbed_' + path
    return url
  }


  //Fill empty array
  function fillActiveTabs(url, tabbed) {
    var arr = {}
    Array.from(tabbed).forEach(function(item, index) {
      var active = item.getElementsByClassName('active')[0].getAttribute('aria-controls')
      arr[index] = active
    });

    try {
      localStorage.setItem(url, JSON.stringify(arr))
    } catch (e) {
      localStorage.clear()
      localStorage.setItem(url, JSON.stringify(arr))
    }
  }


  //Set all tabs active
  function setActiveTabs(activeTabs) {
    array = JSON.parse(activeTabs);
    jQuery.each(array, function(index, item){
      jQuery('[aria-controls=' + item + ']').tab('show')
      jQuery('[data-toggle="tooltip"]').tooltip()
    })
  }
  // ==========================


})
