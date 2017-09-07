export default {
  model: {           
    id: null,
    first_name: null,
    last_name: null,
    organization: null,
    phone: null,
    email: null,
    charging: null
  },
  schema: {
    groups: [
      {
        fields: [
          {
            type: 'markdown',
            text: '# Parks and Recreation\n## Application And Permit For Use Of Recreation Facilities By Groups',
            model: 'fo'
          }
        ]
      },
      {
        legend: "Application Information",
        fields: [
          {
            type: "input",
            inputType: "text",
            label: "Applicant First Name",
            model: "first_name",
            required: true,
            validator: 'string'
          },
          {
            type: "input",
            inputType: "text",
            label: "Applicant Last Name",
            model: "last_name",
            required: true,
            validator: 'string'
          },
          {
            type: "input",
            inputType: "text",
            label: "Applicant Organization Name",
            model: "organization",
            required: true,
            validator: 'string'
          },
          {
            type: "input",
            inputType: "text",
            label: "Applicant Phone",
            model: "phone",
            required: true,
            validator: 'string'
          },
          {
            type: "input",
            inputType: "text",
            label: "Email Address",
            model: "email",
            required: true,
            validator: 'email'
          }
        ]
      },
      {
        legend: "Activity Information",
        fields: [
          {
            type: "input",
            inputType: "text",
            label: "Facility / Park Name",
            model: "facility_park_name",
            required: true,
            validator: 'string'
          },
          {
            type: "radios",
            inputType: "text",
            label: "Requested Facility",
            model: "requested_facility",
            required: true,
            validator: 'string',
            values: [
              'Computer lab',
              'Multi-purpose Room',
              'Auditorium',
              'Gym',
              'Other'
            ]
          },
          {
            type: "input",
            inputType: "text",
            label: "Requested Facility Other",
            model: "requested_facility_other",
            validator: 'string',
            visible: function (model) {
              return model && model.requested_facility == 'Other'
            }
          },
          {
            type: "select",
            inputType: "text",
            label: "Age Group",
            model: "age_group",
            required: true,
            values: [
              'Under 5',
              '5-10',
              '10-15',
              '15-18',
              '18+'
            ]
          },
          {
            type: "input",
            inputType: "text",
            label: "Activity Type(s)",
            model: "activity_types",
            required: true,
            validator: 'string'
          },
          {
            type: "input",
            inputType: "text",
            label: "School Name (If Applicable)",
            model: "school_name",
            validator: 'string'
          },
          {
            type: "radios",
            inputType: "boolean",
            label: "Will you be charging a fee to participants of this program?",
            model: "charging",
            required: true,
            values: [
              {name: 'Yes', value: true},
              {name: 'No', value: false}
            ]
          },
          {
            type: "input",
            inputType: "number",
            label: "Expected Group Size",
            model: "expected_group_size",
            required: true
          },
          {
            type: "radios",
            inputType: "text",
            label: "Group Size Per",
            model: "group_size_per",
            required: true,
            values: [
              'Day / Night',
              'Season',
            ]
          },
          {
            type: "textArea",
            inputType: "text",
            label: "Event Description",
            model: "event_description",
            required: true
          }
        ]
      },
      {
        legend: "Requested Schedule",
        fields: [
          {
            type: "time-range",
            label: "Monday",
            model: "monday"
          },
          {
            type: "time-range",
            label: "Tuesday",
            model: "tuesday"
          },
          {
            type: "time-range",
            label: "Wednesday",
            model: "wednesday"
          },
          {
            type: "time-range",
            label: "Thursday",
            model: "thursday"
          },
          {
            type: "time-range",
            label: "Friday",
            model: "friday"
          },
          {
            type: "time-range",
            label: "Saturday",
            model: "saturday"
          },
          {
            type: "time-range",
            label: "Sunday",
            model: "sunday"
          },
          {
            type: "input",
            inputType: "date",
            label: "Requested Date From",
            model: "date_from"
          },
          {
            type: "input",
            inputType: "date",
            label: "Requested Date To",
            model: "date_to"
          }
        ]
      },
      // TODO: Approved Schedule ? - internal
      {
        fields: [
          {
            type: 'markdown',
            text: '### Rules and Regulations\n\n- Applicant/Organization will neither allow, nor engage in, an discriminatory practice or policies regarding race, creed, sex, sexual orientation, age, or national origin. Applicant shall comply with all applicable local, state, or federal laws, rules, or regulations, and obtain all necessary permits and licenses, in exercising the rights granted under this permit including but not limited to, ASCAP, BMI, SESAC, and similar performance licenses, required for the use of copyrighted or licensed material in connection with the event or activity, or otherwise required in connection with the use of the facility for the event or activity.\n- Permitted dates/times must be approved in advance by the facility supervisor; cancellations must be reported promptly.\n- BANNED SUBSTANCES (alcohol, drugs) and  LOUD, VULGAR, CONFRONTATIONAL LANGUAGE is not permitted on facility grounds.',
            model: 'fo'
          }
        ]
      },
      {
        fields: [
          {
            type: 'signature',
            model: 'signature'
          }
        ]
      }
    ]
  },
  formOptions: {
    validateAfterLoad: false,
    validateAfterChanged: true
  }
}