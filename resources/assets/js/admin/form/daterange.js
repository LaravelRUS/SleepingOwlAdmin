Admin.Modules.add('form.elements.daterange', () => {
    $('.input-daterange').each((i, item) => {
        let $self = $(item);

        let picker = $self.daterangepicker({
            showDropdowns: true,
            locale: {
                format: $self.data('format'),
                separator: '::'
            }
        })

        if ($self.data('startdate')) {
            $self.data('daterangepicker').setStartDate($self.data('startdate'));
        }

        if ($self.data('enddate')) {
            $self.data('daterangepicker').setEndDate($self.data('enddate'));
        }
    })
})