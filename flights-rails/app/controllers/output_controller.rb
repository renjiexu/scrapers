class OutputController < ApplicationController
  def hello
    f = open('~/output', 'r')
    render plain: f.read
  end
end
