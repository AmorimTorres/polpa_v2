pipeline {
    agent {
        docker {
            image 'node:20-bookworm' // Imagem oficial estável
        }
    }

    stages {
        stage('restore') {
            steps {
                echo "Restoring dependencies..."
                sh 'npm ci'
            }
        }
        stage('build') {
            steps {
                echo "Building the application..."
                sh 'npm run build'
            }
        }
    }
}
