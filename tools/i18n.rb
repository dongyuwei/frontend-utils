#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require 'rubygems'
require 'sequel'
require 'yajl/json_gem'
require 'tmpdir'
require 'sinatra'
require 'fileutils'


def export_i18n_js(is_mobile = false)
  db = Sequel.connect(:adapter => 'mysql', 
                      :user => 'root', 
                      :host => 'tools.tbox.me', 
                      :database => is_mobile ? 'tpl_mobile': 'tpl_system',
                      :password=>'xxxxxxx',
                      :encoding => 'utf8')

  dataset = db[:ui_langs]
  columns = dataset.columns - [:id,:name,:active,:last_modified]

  files = {}
  columns.each do|lang|
    files[lang] = {}
  end
  db.fetch('SELECT * FROM ui_langs where active="1"') do |row|
    columns.each do|c|
      if row[:name].index(".") 
        # "pageBar.prev": "Previous" ------> "pageBar":{"prev" : "Previous"}
        arr = row[:name].split(".")
        files[c][arr[0]] = files[c][arr[0]] || {} 
        files[c][arr[0]][arr[1]] = row[c]
      else
        files[c][row[:name]] = row[c]
      end
    end
  end
  tmp_dir = Dir.mktmpdir
  columns.each do|lang|
    content = ['litb = window.litb || {};',"litb.langs = #{JSON.pretty_generate(files[lang])};"].join(' ')
    File.open("#{tmp_dir}/#{lang}.js",'w')do |f|
      f.puts content
    end
  end
  puts (is_mobile ? "mobile": "web") + " i18n js files generated in #{tmp_dir}"

  tmp_dir
end


def zip_dir tmp_dir
  system("cd #{tmp_dir} && zip -r i18n.zip ./* ")
  tmp_dir
end

get '/' do
  "<a href='/i18n/web'>export all web language js</a><br/>
  <a href='/i18n/mobile'>export all mobile language js</a>"
end

get '/i18n/web' do
  tmp_dir = zip_dir(export_i18n_js())
  redirect "/download?dir=#{tmp_dir}&file=#{tmp_dir}/i18n.zip"
end

get '/i18n/mobile' do
  tmp_dir = zip_dir(export_i18n_js(true))
  redirect "/download?dir=#{tmp_dir}&file=#{tmp_dir}/i18n.zip"
end

after '/download' do 
  Thread.new do
    sleep 50
    FileUtils.rm_rf("#{params[:dir]}")
    puts "rm -rf #{params[:dir]}"
  end
end

get '/download' do 
  send_file "#{params[:file]}", :filename => 'i18n.zip', :type => 'Application/octet-stream'
end