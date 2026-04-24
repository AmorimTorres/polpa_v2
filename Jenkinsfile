pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo ""
                echo "Starting checkout of the Polpa V2 repository..."
                echo ""
                checkout scm
            }
        }
        stage('restore') {
            steps {
                echo ""
                echo "Restoring dependencies..."
                echo ""
                sh 'npm ci'
            }
        }
        stage('build') {
            steps {
                echo ""
                echo "Building the application..."
                echo ""
                sh 'npm run build'
            }
        }
    }
}