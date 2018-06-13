# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  config.vm.box = "box-cutter/ubuntu1604"

  config.vm.define :controller do |controller|
    controller.vm.network :private_network, ip: '192.168.99.10'
  end

  config.vm.define :agent1 do |agent|
    agent.vm.network :private_network, ip: '192.168.99.20'
  end

  config.vm.define :agent2 do |agent|
    agent.vm.network :private_network, ip: '192.168.99.21'
  end
end
