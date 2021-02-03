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
      image     = "projects/cos-cloud/global/images/cos-stable-85-13310-1209-3"
      size        = "10"
    }
  }

  network_interface {
  network = "default"
    access_config {
      nat_ip = google_compute_address.earthquakinator_static_ip.address
    }
  }

  metadata = {
    gce-container-declaration = "gcr.io/earthquakinator/earthquakinator-image:latest"
  }
}

# Create a static IP that will be assigned to our instance. This will allow users to hit it externally.
resource "google_compute_address" "earthquakinator_static_ip" {
  name = "earthquakinator-external"
}
