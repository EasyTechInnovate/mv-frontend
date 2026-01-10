import { defineField, defineType } from 'sanity'

export const blog = defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Music Distribution', value: 'music-distribution' },
          { title: 'Industry News', value: 'industry-news' },
          { title: 'Tips & Tricks', value: 'tips-tricks' },
          { title: 'Artist Stories', value: 'artist-stories' },
          { title: 'Technology', value: 'technology' }
        ]
      },
      validation: (Rule) => Rule.required()
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200)
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' }
        ]
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      initialValue: 0,
      readOnly: true
    }),
    defineField({
      name: 'comments',
      title: 'Comments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'email', type: 'string', title: 'Email' },
            { name: 'comment', type: 'text', title: 'Comment' },
            { name: 'date', type: 'datetime', title: 'Date' },
            { name: 'approved', type: 'boolean', title: 'Approved', initialValue: false }
          ]
        }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta Title' },
        { name: 'metaDescription', type: 'text', title: 'Meta Description' },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }], title: 'Keywords' }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'thumbnail',
      status: 'status'
    },
    prepare(selection) {
      const { title, author, status } = selection
      return {
        ...selection,
        subtitle: `${author} • ${status}`
      }
    }
  }
})
