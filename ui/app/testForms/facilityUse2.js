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
          validation: {
            required: true, // ???
            minLength: 2
          }
        },
        {
          type: 'text',
          label: 'Applicant Last Name',
          field_name: 'last_name',
          validation: {
            required: true
          }
        },
        {
          type: 'text',
          label: 'Applicant Organization Name',
          field_name: 'organization',
          validation: {
            required: true
          }
        },
        {
          type: 'text',
          label: 'Applicant Phone',
          field_name: 'phone',
          validation: {
            required: true
          }
        },
        {
          type: 'text',
          label: 'Email Address',
          field_name: 'email',
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
          validation: {
            required: true
          }
        },
        {
          type: 'radios',
          label: 'Requested Facility',
          field_name: 'requested_facility',
          validation: {
            required: true
          },
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
          validation: {
            required: true
          },
          visible: "requested_facility == 'Other'"
        },
        {
          type: 'select',
          label: 'Age Group',
          field_name: 'age_group',
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
          validation: {
            required: true
          }
        },
        {
          type: 'text',
          label: 'School Name (If Applicable)',
          field_name: 'school_name',
          validation: {
            required: true
          }
        },
        {
          type: 'radios',
          data_type: 'boolean',
          label: 'Will you be charging a fee to participants of this program?',
          field_name: 'charging',
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
          validation: {
            required: true
          }
        },
        {
          type: 'radios',
          label: 'Group Size Per',
          field_name: 'group_size_per',
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
          validation: {
            required: true
          }
        },
        {
          type: 'repeating',
          field_name: 'things',
          legend: 'Things',
          add_label: 'Add Thing',
          items: [
            {
              type: 'text',
              label: 'A Thing',
              field_name: 'a_thing'
            },
            {
              type: 'radios',
              label: 'Which thing?',
              field_name: 'which_thing',
              items: [
                'Car',
                'Stereo'
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'markdown',
      text: '### Rules and Regulations\n\n- Applicant/Organization will neither allow, nor engage in, an discriminatory practice or policies regarding race, creed, sex, sexual orientation, age, or national origin. Applicant shall comply with all applicable local, state, or federal laws, rules, or regulations, and obtain all necessary permits and licenses, in exercising the rights granted under this permit including but not limited to, ASCAP, BMI, SESAC, and similar performance licenses, required for the use of copyrighted or licensed material in connection with the event or activity, or otherwise required in connection with the use of the facility for the event or activity.\n- Permitted dates/times must be approved in advance by the facility supervisor; cancellations must be reported promptly.\n- BANNED SUBSTANCES (alcohol, drugs) and  LOUD, VULGAR, CONFRONTATIONAL LANGUAGE is not permitted on facility grounds.'
    }
  ]
}