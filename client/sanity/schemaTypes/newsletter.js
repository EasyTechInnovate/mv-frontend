import { defineField, defineType } from 'sanity'

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'subjectLine',
      title: 'Subject Line',
      type: 'string',
      validation: (Rule) => Rule.required().max(100)
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'string',
      options: {
        list: [
          { title: 'All Subscribers', value: 'all' },
          { title: 'Artists Only', value: 'artists' },
          { title: 'Labels Only', value: 'labels' },
          { title: 'New Subscribers', value: 'new' }
        ]
      },
      initialValue: 'all',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Sent', value: 'sent' }
        ]
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'scheduledDate',
      title: 'Scheduled Date',
      type: 'datetime'
    }),
    defineField({
      name: 'sentDate',
      title: 'Sent Date',
      type: 'datetime',
      readOnly: true
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'object',
      readOnly: true,
      fields: [
        { name: 'sent', type: 'number', title: 'Total Sent', initialValue: 0 },
        { name: 'opened', type: 'number', title: 'Opened', initialValue: 0 },
        { name: 'clicked', type: 'number', title: 'Clicked', initialValue: 0 }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subjectLine: 'subjectLine',
      status: 'status'
    },
    prepare(selection) {
      const { title, subjectLine, status } = selection
      return {
        title,
        subtitle: `${subjectLine} • ${status}`
      }
    }
  }
})

export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscribers',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email()
    }),
    defineField({
      name: 'joinedDate',
      title: 'Joined Date',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Subscribed', value: 'subscribed' },
          { title: 'Unsubscribed', value: 'unsubscribed' }
        ]
      },
      initialValue: 'subscribed',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'unsubscribedDate',
      title: 'Unsubscribed Date',
      type: 'datetime'
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string'
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string'
    }),
    defineField({
      name: 'subscriberType',
      title: 'Subscriber Type',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Artist', value: 'artist' },
          { title: 'Label', value: 'label' }
        ]
      },
      initialValue: 'general'
    })
  ],
  preview: {
    select: {
      email: 'email',
      status: 'status',
      firstName: 'firstName',
      lastName: 'lastName'
    },
    prepare(selection) {
      const { email, status, firstName, lastName } = selection
      const name = firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : 'No name'
      return {
        title: email,
        subtitle: `${name} • ${status}`
      }
    }
  }
})
