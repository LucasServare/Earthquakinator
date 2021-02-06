terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "3.5.0"
    }
  }
}

provider "google" {
  # credentials = file("tf_creds.json")
  project = "earthquakinator"
  region  = "us-east4"
  zone    = "us-east4-c"
}

# Create an instance. We'll use this as our web server to host our service.
resource "google_compute_instance" "earthquakinator" {
  name         = "earthquakinator-terraform"
  machine_type = "f1-micro"
  tags         = ["web"]
  zone         = "us-east4-c"

  boot_disk {
    auto_delete = "true"
    initialize_params {
      image     = "projects/centos-cloud/global/images/centos-8-v20210122"
      size        = "20"
    }
  }

  network_interface {
  network = "default"
    access_config {
      nat_ip = google_compute_address.earthquakinator_static_ip.address
    }
  }

  metadata = {
    startup-script = <<EOT
                      sudo yum install -y yum-utils

                      sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

                      sudo yum -y install docker-ce docker-ce-cli containerd.io

                      sudo systemctl start docker

                      sudo docker run us-east4-docker.pkg.dev/earthquakinator/earthquakinator-images/earthquakinator-image:latest
                      EOT
  }
}

# Create a static IP that will be assigned to our instance. This will allow users to hit it externally.
resource "google_compute_address" "earthquakinator_static_ip" {
  name = "earthquakinator-external"
}
