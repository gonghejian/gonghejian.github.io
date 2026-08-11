# frozen_string_literal: true

require "date"
require "pathname"
require "yaml"

module Knowledge
  CATEGORIES = %w[
    ai-basics
    startup-45
    enterprise-ai
    products
    content-assets
  ].freeze

  class ValidationError < StandardError; end

  # Canonical data type used by every knowledge query.
  Article = Struct.new(
    :title,
    :slug,
    :category,
    :tags,
    :status,
    :created_at,
    :updated_at,
    :summary,
    :content,
    :source_path,
    :format,
    keyword_init: true
  ) do
    def public?
      status == "public"
    end

    def to_h
      {
        "title" => title,
        "slug" => slug,
        "category" => category,
        "tags" => tags,
        "status" => status,
        "createdAt" => created_at.iso8601,
        "updatedAt" => updated_at.iso8601,
        "summary" => summary,
        "content" => content,
        "sourcePath" => source_path,
        "format" => format
      }
    end

    alias to_liquid to_h
  end

  # Reads YAML frontmatter without coupling content access to a page layout.
  class FrontmatterReader
    FRONTMATTER = /\A---\s*\r?\n(.*?)\r?\n---\s*\r?\n/m.freeze
    SUPPORTED_EXTENSIONS = %w[.md .mdx].freeze

    def self.read(path, root:)
      extension = File.extname(path).downcase
      unless SUPPORTED_EXTENSIONS.include?(extension)
        raise ValidationError, "Unsupported knowledge format: #{path}"
      end

      source = File.read(path, encoding: "bom|utf-8")
      match = FRONTMATTER.match(source)
      raise ValidationError, "Missing YAML frontmatter: #{path}" unless match

      data = YAML.safe_load(
        match[1],
        permitted_classes: [Date, Time],
        aliases: false
      ) || {}

      build_article(data, source[match.end(0)..].to_s, path, root, extension)
    rescue Psych::SyntaxError => e
      raise ValidationError, "Invalid YAML frontmatter in #{path}: #{e.message}"
    end

    def self.build_article(data, content, path, root, extension)
      required = %w[title slug category tags status createdAt updatedAt summary]
      missing = required.select { |field| blank?(data[field]) }
      unless missing.empty?
        raise ValidationError, "Missing #{missing.join(', ')} in #{path}"
      end

      string_fields = %w[title slug category status summary]
      invalid_strings = string_fields.reject { |field| data[field].is_a?(String) }
      unless invalid_strings.empty?
        raise ValidationError, "#{invalid_strings.join(', ')} must be strings in #{path}"
      end

      slug = data["slug"].strip
      unless /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/.match?(slug)
        raise ValidationError, "slug must use lowercase letters, numbers, and hyphens in #{path}"
      end

      category = data["category"].strip
      unless CATEGORIES.include?(category)
        raise ValidationError, "Unknown category #{category.inspect} in #{path}"
      end

      relative_path = Pathname.new(path).relative_path_from(Pathname.new(root)).to_s.tr("\\", "/")
      unless relative_path.start_with?("#{category}/")
        raise ValidationError, "category must match the first source directory in #{path}"
      end
      unless File.basename(path, extension) == slug
        raise ValidationError, "filename must match slug in #{path}"
      end

      tags = data["tags"]
      raise ValidationError, "tags must be an array in #{path}" unless tags.is_a?(Array)

      status = data["status"].to_s
      unless %w[public draft private].include?(status)
        raise ValidationError, "status must be public, draft, or private in #{path}"
      end
      if data.key?("published")
        raise ValidationError, "use status instead of published in #{path}"
      end

      created_at = parse_date(data["createdAt"], "createdAt", path)
      updated_at = parse_date(data["updatedAt"], "updatedAt", path)
      if updated_at < created_at
        raise ValidationError, "updatedAt cannot be earlier than createdAt in #{path}"
      end

      Article.new(
        title: data["title"].to_s.strip,
        slug: slug,
        category: category,
        tags: tags.map(&:to_s).map(&:strip).reject(&:empty?).uniq.freeze,
        status: status,
        created_at: created_at,
        updated_at: updated_at,
        summary: data["summary"].to_s.strip,
        content: content.strip,
        source_path: relative_path,
        format: extension.delete_prefix("."),
      ).freeze
    end
    private_class_method :build_article

    def self.parse_date(value, field, path)
      return value if value.is_a?(Date)
      return value.to_date if value.respond_to?(:to_date)

      Date.iso8601(value.to_s)
    rescue Date::Error
      raise ValidationError, "#{field} must use YYYY-MM-DD in #{path}"
    end
    private_class_method :parse_date

    def self.blank?(value)
      value.nil? || (value.respond_to?(:empty?) && value.empty?)
    end
    private_class_method :blank?
  end

  class Repository
    attr_reader :articles

    def self.from_directory(directory)
      paths = FrontmatterReader::SUPPORTED_EXTENSIONS.flat_map do |extension|
        Dir.glob(File.join(directory, "**", "*#{extension}"))
      end.sort

      new(paths.map { |path| FrontmatterReader.read(path, root: directory) })
    end

    def initialize(articles)
      @articles = articles.freeze
      duplicate_slugs = articles.group_by(&:slug).select { |_slug, items| items.length > 1 }.keys
      unless duplicate_slugs.empty?
        raise ValidationError, "Duplicate knowledge slugs: #{duplicate_slugs.join(', ')}"
      end
    end

    def all(include_unpublished: false)
      selected = include_unpublished ? articles : articles.select(&:public?)
      selected.sort_by { |article| [article.updated_at, article.slug] }.reverse
    end

    def find_by_slug(slug, include_unpublished: false)
      all(include_unpublished: include_unpublished).find { |article| article.slug == slug.to_s }
    end

    def by_category(category, include_unpublished: false)
      all(include_unpublished: include_unpublished).select do |article|
        article.category == category.to_s
      end
    end

    def by_tag(tag, include_unpublished: false)
      all(include_unpublished: include_unpublished).select do |article|
        article.tags.include?(tag.to_s)
      end
    end

    def recently_updated(limit = 5, include_unpublished: false)
      raise ArgumentError, "limit must be a non-negative integer" unless limit.is_a?(Integer) && limit >= 0

      all(include_unpublished: include_unpublished).first(limit)
    end
  end

  module LiquidFilters
    def knowledge_by_slug(articles, slug)
      Array(articles).find { |article| article["slug"] == slug.to_s }
    end

    def knowledge_by_category(articles, category)
      Array(articles).select { |article| article["category"] == category.to_s }
    end

    def knowledge_by_tag(articles, tag)
      Array(articles).select { |article| Array(article["tags"]).include?(tag.to_s) }
    end

    def knowledge_recently_updated(articles, limit = 5)
      Array(articles).sort_by { |article| [article["updatedAt"], article["slug"]] }.reverse.first(limit.to_i)
    end
  end
end

if defined?(Jekyll)
  class KnowledgeDataGenerator < Jekyll::Generator
    safe true
    priority :highest

    def generate(site)
      repository = Knowledge::Repository.from_directory(site.in_source_dir("_knowledge"))
      knowledge_data = site.data["knowledge"] ||= {}
      # Only public records enter Liquid's render context. Draft and private
      # records remain queryable through Repository with include_unpublished.
      knowledge_data["articles"] = repository.all.map(&:to_h)

      collection = site.collections["knowledge"]
      return unless collection

      public_by_slug = repository.all.to_h { |article| [article.slug, article] }
      collection.docs.select! do |document|
        article = public_by_slug[document.data["slug"].to_s]
        next false unless article

        document.data["description"] = article.summary
        created_time = Time.utc(article.created_at.year, article.created_at.month, article.created_at.day)
        updated_time = Time.utc(article.updated_at.year, article.updated_at.month, article.updated_at.day)
        document.data["date"] = created_time
        document.data["last_modified_at"] = updated_time
        document.data["seo"] = { "type" => "BlogPosting" }
        true
      end
      Jekyll.logger.info("Knowledge:", "loaded #{repository.articles.length} articles")
    rescue Knowledge::ValidationError => e
      raise Jekyll::Errors::FatalException, e.message
    end
  end

  Liquid::Template.register_filter(Knowledge::LiquidFilters)

  # MDX files use the Markdown subset in V1. JSX/component execution is
  # intentionally unsupported so the content remains portable and static.
  class KnowledgeMdxConverter < Jekyll::Converter
    safe true
    priority :low

    def matches(extension)
      extension.casecmp(".mdx").zero?
    end

    def output_ext(_extension)
      ".html"
    end

    def convert(content)
      Jekyll::Converters::Markdown.new(@config).convert(content)
    end
  end
end
