# frozen_string_literal: true

require "pathname"
require_relative "../_plugins/knowledge_repository"

root = Pathname.new(__dir__).join("..").expand_path
repository = Knowledge::Repository.from_directory(root.join("_knowledge").to_s)

abort "Knowledge validation failed: no articles found" if repository.articles.empty?

categories = repository.all(include_unpublished: true).map(&:category).uniq.sort
formats = repository.all(include_unpublished: true).map(&:format).uniq.sort

puts "Knowledge validation passed"
puts "Articles: #{repository.articles.length} (#{repository.all.length} public)"
puts "Categories: #{categories.join(', ')}"
puts "Formats: #{formats.join(', ')}"
