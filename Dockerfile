FROM node:14.11.0
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY backend ./backend
COPY frontend ./frontend
RUN ls
RUN cd backend && npm install && npm run build
RUN rm -rf src
ENV NODE_ENV=production
ENV CLIENT_ID=ca1cbc4582c8437d9322b5098114f980
ENV CLIENT_SECRET=d37081de634c453b88a7478e2ac7176d
ENV REDIRECT_URI=http://bp.example.com:4000/authorize/
ENV PORT=4000
ENV MONGODB_URI=mongodb+srv://trevorflanigan:H0enGiahhHk2BlV3@bullpen.boctd.mongodb.net/test?authSource=admin&replicaSet=atlas-4t86fq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
RUN cd frontend && npm run build
RUN mv frontend/build backend/public
RUN rm -rf frontend
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
EXPOSE 4000
CMD [ "node", "backend/build/src/index.js" ]