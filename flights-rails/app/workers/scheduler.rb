require 'sidekiq-scheduler'

class Scheduler
  include Sidekiq::Worker

  def perform
    puts "RUNNING"
    system("node crawler >> output")
  end
end