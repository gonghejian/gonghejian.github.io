# frozen_string_literal: true

require "pathname"
require_relative "../_plugins/knowledge_repository"

root = Pathname.new(__dir__).join("..").expand_path
repository = Knowledge::Repository.from_directory(root.join("_knowledge").to_s)

def assert(condition, message)
  raise "Assertion failed: #{message}" unless condition
end

assert(repository.all.empty?, "drafts are excluded from all public articles")
assert(repository.all(include_unpublished: true).length == 5, "get all authoring articles")
assert(repository.find_by_slug("what-is-agent").nil?, "draft slug is excluded from public queries")
assert(repository.find_by_slug("what-is-agent", include_unpublished: true)&.title == "Agent 到底是什么", "get draft by slug for authoring")
assert(repository.by_category("enterprise-ai").empty?, "draft category is excluded from public queries")
assert(repository.by_category("enterprise-ai", include_unpublished: true).map(&:slug) == ["interview-before-solution"], "get draft by category for authoring")
assert(repository.by_tag("用户访谈").empty?, "draft tag is excluded from public queries")
assert(repository.by_tag("用户访谈", include_unpublished: true).length == 2, "get drafts by tag for authoring")
assert(repository.recently_updated(2).empty?, "drafts are excluded from recent public updates")
assert(repository.recently_updated(2, include_unpublished: true).map(&:updated_at) == [Date.new(2026, 8, 11), Date.new(2026, 8, 11)], "get recent drafts for authoring")
assert(repository.find_by_slug("minimum-viable-ai-tool", include_unpublished: true)&.format == "mdx", "read draft MDX frontmatter")
assert(repository.find_by_slug("missing-slug").nil?, "missing slug returns nil")
assert(Knowledge::Repository.new([]).all.empty?, "empty repository")

draft = Knowledge::Article.new(
  title: "Draft",
  slug: "draft",
  category: "ai-basics",
  tags: ["Draft"],
  status: "draft",
  created_at: Date.new(2026, 8, 11),
  updated_at: Date.new(2026, 8, 11),
  summary: "Draft summary",
  content: "Draft content",
  source_path: "ai-basics/draft.md",
  format: "md"
)
draft_repository = Knowledge::Repository.new([draft])
assert(draft_repository.all.empty?, "draft excluded from public queries")
assert(draft_repository.all(include_unpublished: true).length == 1, "draft available to authoring queries")

puts "Knowledge query tests passed (15 assertions)"
