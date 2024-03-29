import { CfnOutput } from "aws-cdk-lib";
import {
  CognitoUserPoolsAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { IdentityPoolWrapper } from "./IdentityPoolWrapper";

export class AuthorizerWrapper {
  private scope: Construct;
  private api: RestApi;

  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  public authorizor: CognitoUserPoolsAuthorizer;
  private IdentityPoolWraper: IdentityPoolWrapper;

  constructor(scope: Construct, api: RestApi) {
    this.scope = scope;
    this.api = api;
    this.initialize();
  }

  private initialize() {
    this.createUserPool();
    this.addUserPoolClient();
    this.createAuthorizer();
    this.initializeIdentityWrapper();
    this.createAdminGroup();
  }

  private createUserPool() {
    this.userPool = new UserPool(this.scope, "SpaceUserPool", {
      userPoolName: "SpaceUserPool",
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });
    new CfnOutput(this.scope, "UserPoolId", {
      value: this.userPool.userPoolId,
    });
  }

  private addUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("SpaceUserPool-client", {
      userPoolClientName: "SpaceUserPool-client",
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
    });

    new CfnOutput(this.scope, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private createAuthorizer() {
    this.authorizor = new CognitoUserPoolsAuthorizer(
      this.scope,
      "SpaceUserAuthorizer",
      {
        cognitoUserPools: [this.userPool],
        authorizerName: "SpaceUserAuthorizer",
        identitySource: "method.request.header.Authorization",
      }
    );

    this.authorizor._attachToApi(this.api);
  }

  private initializeIdentityWrapper() {
    this.IdentityPoolWraper = new IdentityPoolWrapper(
      this.scope,
      this.userPool,
      this.userPoolClient
    );
  }

  private createAdminGroup() {
    new CfnUserPoolGroup(this.scope, "admins", {
      groupName: "admins",
      userPoolId: this.userPool.userPoolId,
      roleArn: this.IdentityPoolWraper.adminRole.roleArn,
    });
  }
}
