export default {
  schema: [
    {
      type: 'markdown',
      text: '# Parks and Recreation\n## Application And Permit For Use Of Recreation Facilities By Groups'
    },
    {
      type: 'fieldset',
      legend: 'Application Information',
      children: [
        {
          type: 'text',
          label: 'Applicant First Name',
          field_name: 'first_name',
          required: true,
          validator: 'string'
        },
        {
          type: 'text',
          label: 'Applicant Last Name',
          field_name: 'last_name',
          required: true,
          validator: 'string'
        },
        {
          type: 'text',
          label: 'Applicant Organization Name',
          field_name: 'organization',
          required: true,
          validator: 'string'
        },
        {
          type: 'text',
          label: 'Applicant Phone',
          field_name: 'phone',
          required: true,
          validator: 'string'
        },
        {
          type: 'text',
          label: 'Email Address',
          field_name: 'email',
          required: true,
          validator: 'email'
        }
      ]
    },
    {
      type: 'fieldset',
      legend: 'Activity Information',
      children: [
        {
          type: 'text',
          label: 'Facility / Park Name',
          field_name: 'facility_park_name',
          required: true,
          validator: 'string'
        },
        {
          type: 'radios',
          label: 'Requested Facility',
          field_name: 'requested_facility',
          required: true,
          validator: 'string',
          items: [
            'Computer lab',
            'Multi-purpose Room',
            'Auditorium',
            'Gym',
            'Other'
          ]
        },
        {
          type: 'text',
          label: 'Requested Facility Other',
          field_name: 'requested_facility_other',
          validator: 'string',
          visible: "requested_facility == 'Other'"
        },
        {
          type: 'select',
          label: 'Age Group',
          field_name: 'age_group',
          required: true,
          items: [
            'Under 5',
            '5-10',
            '10-15',
            '15-18',
            '18+'
          ]
        },
        {
          type: 'text',
          label: 'Activity Type(s)',
          field_name: 'activity_types',
          required: true,
          validator: 'string'
        },
        {
          type: 'text',
          label: 'School Name (If Applicable)',
          field_name: 'school_name',
          validator: 'string'
        },
        {
          type: 'radios',
          data_type: 'boolean',
          label: 'Will you be charging a fee to participants of this program?',
          field_name: 'charging',
          required: true,
          items: [
            {
              label: 'Yes',
              value: true
            },
            {
              label: 'No',
              value: false
            }
          ]
        },
        {
          type: 'text',
          input_type: 'number',
          data_type: 'number',
          label: 'Expected Group Size',
          field_name: 'expected_group_size',
          required: true
        },
        {
          type: 'radios',
          label: 'Group Size Per',
          field_name: 'group_size_per',
          required: true,
          items: [
            'Day / Night',
            'Season',
          ]
        },
        {
          type: 'text',
          multiline: true,
          label: 'Event Description',
          field_name: 'event_description',
          required: true
        }
      ]
    },
    {
      type: 'markdown',
      text: '### Rules and Regulations\n\n- Applicant/Organization will neither allow, nor engage in, an discriminatory practice or policies regarding race, creed, sex, sexual orientation, age, or national origin. Applicant shall comply with all applicable local, state, or federal laws, rules, or regulations, and obtain all necessary permits and licenses, in exercising the rights granted under this permit including but not limited to, ASCAP, BMI, SESAC, and similar performance licenses, required for the use of copyrighted or licensed material in connection with the event or activity, or otherwise required in connection with the use of the facility for the event or activity.\n- Permitted dates/times must be approved in advance by the facility supervisor; cancellations must be reported promptly.\n- BANNED SUBSTANCES (alcohol, drugs) and  LOUD, VULGAR, CONFRONTATIONAL LANGUAGE is not permitted on facility grounds.'
    }
  ]
}