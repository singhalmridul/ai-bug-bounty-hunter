terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "backend" {
  name = "ai-bugboundy-backend"
}

resource "aws_ecr_repository" "crawler" {
  name = "ai-bugboundy-crawler"
}

# Add EKS cluster resource here
