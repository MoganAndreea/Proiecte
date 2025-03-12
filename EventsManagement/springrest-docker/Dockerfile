# Build stage: Use Maven to build the application
FROM maven AS build
# Set the working directory in the container
WORKDIR /home/app
# Copy the pom.xml and the source code into the container
COPY pom.xml ./
COPY src ./src
# Run Maven build to package the application
RUN mvn clean package
# Run stage: Use OpenJDK to run the application
FROM openjdk:17
# Copy the jar file from the build stage to the current stage
COPY --from=build /home/app/target/springrest-docker-0.0.1-SNAPSHOT.jar /app.jar
# Expose the application port (7000)
EXPOSE 7000
# Command to run the application
ENTRYPOINT ["java", "-jar", "/app.jar"]
