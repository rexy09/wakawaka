import Env from '../../../config/env';

function base64urlEncode(input: string | ArrayBuffer): string {
  let bytes: Uint8Array;

  if (typeof input === "string") {
    // Convert the string to a Uint8Array
    bytes = new TextEncoder().encode(input);
  } else {
    // Ensure input is treated as a Uint8Array
    bytes = new Uint8Array(input);
  }

  // Convert bytes to a binary string
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));

  // Convert the binary string to a base64 encoded string
  const base64 = btoa(binary);

  // Convert base64 to base64url by replacing characters and removing trailing '='
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export class ChatbotService {
  private jwtSecret: string;
  private engineId: string = 'engine_1';
  private baseUrl: string;

  constructor() {
    this.jwtSecret = Env.JWT_SECRET;
    this.baseUrl = Env.CHATBOT_URL;
  }

  private generateChatbotConfig(
    authToken: string,
    role: string,
    username: string
  ) {
    const ownerApiList = [
      {
        end_point_name: 'Get All Jobs',
        url: `${Env.baseURL}/owner/order/`,
        method: 'GET',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'type',
            required_parm_type: 'query',
            data_type: 'all',
            is_required: true,
            is_nullable: false,
            description:
              'List all available cargo jobs/orders it should be all for all jobs'
          }
        ],
        end_point_description:
          'Fetch all available cargo jobs/orders in the system',
        end_point_creation_timestamp: new Date().toISOString()
      },
      {
        end_point_name: 'Get Owner Bids',
        url: `${Env.baseURL}/operation/bidding/`,
        method: 'GET',
        headers: {
          Authorization: authToken
        },
        required_parameters: [],
        end_point_description: "Retrieve all bids for owner's cargo orders",
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      },
      {
        end_point_name: 'Track Order',
        url: `${Env.baseURL}/order_tracking/`,
        method: 'GET',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'id',
            required_parm_type: 'path',
            data_type: 'string',
            is_required: true,
            is_nullable: false,
            description: 'Unique identifier of the order to track'
          }
        ],
        end_point_description:
          'Track the status and location of a specific order by ID',
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      },
      {
        end_point_name: 'Cancel Bid',
        url: `${Env.baseURL}/bids/cancel`,
        method: 'POST',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'id',
            required_parm_type: 'query',
            data_type: 'string',
            is_required: true,
            is_nullable: false,
            description: 'Unique identifier of the bid to cancel'
          }
        ],
        end_point_description: 'Cancel an existing bid for a cargo order',
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      },
      {
        end_point_name: 'Assign Driver to Bid',
        url: `${Env.baseURL}/bids/assign-driver`,
        method: 'PATCH',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'bidId',
            required_parm_type: 'query',
            data_type: 'string',
            is_required: true,
            is_nullable: false,
            description: 'Unique identifier of the bid'
          },
          {
            required_parm_name: 'driverId',
            required_parm_type: 'body',
            data_type: 'string',
            is_required: true,
            is_nullable: false,
            description: 'Unique identifier of the driver to assign'
          },
          {
            required_parm_name: 'state',
            required_parm_type: 'body',
            data_type: 'string',
            is_required: true,
            is_nullable: false,
            description: 'New state for the bid'
          }
        ],
        end_point_description:
          'Assign a driver to a specific bid and update its state',
        sample_request: {
          url: '/api/bids/assign-driver?bidId=bid_123xyz',
          body: {
            driverId: 'driver_456abc',
            state: 'assigned'
          }
        },
        sample_response: {
          status: 200,
          data: {
            message: 'Driver assigned successfully',
            bidId: 'bid_123xyz',
            driverId: 'driver_456abc',
            state: 'assigned'
          }
        },
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      },
      {
        end_point_name: 'List Drivers by Owner',
        url: `${Env.baseURL}/owner/driver`,
        method: 'GET',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'page',
            required_parm_type: 'query',
            data_type: 'number',
            is_required: false,
            is_nullable: true,
            description: 'Page number for pagination (defaults to 1)',
            default_value: 1
          },
          {
            required_parm_name: 'limit',
            required_parm_type: 'query',
            data_type: 'number',
            is_required: false,
            is_nullable: true,
            description: 'Number of drivers per page (defaults to 10)',
            default_value: 10
          },
          {
            required_parm_name: 'order',
            required_parm_type: 'query',
            data_type: 'string',
            is_required: false,
            is_nullable: true,
            description: 'Optional order ID to filter drivers by specific order'
          }
        ],
        end_point_description:
          'Retrieve a paginated list of drivers associated with the authenticated owner',
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      }
    ];

    const regularApiList = [
      {
        end_point_name: 'List all Order',
        url: `${Env.baseURL}/order`,
        method: 'GET',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'id',
            required_parm_type: 'path',
            data_type: 'string',
            is_required: false,
            is_nullable: false,
            description: 'Unique identifier of the order to retrieve'
          }
        ],
        end_point_description:
          'Get detailed information about a specific order but it can list a specific order too when id is provided',
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      },
      {
        end_point_name: 'Track Order',
        url: `${Env.baseURL}/order_tracking/`,
        method: 'GET',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'id',
            required_parm_type: 'path',
            data_type: 'string',
            is_required: true,
            is_nullable: false,
            description: 'Unique identifier of the order to track'
          }
        ],
        end_point_description:
          'Track the status and location of a specific order by ID',
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      },
      {
        end_point_name: 'Get All the  Bids for a speicific order',
        url: `${Env.baseURL}/operation/bidding/`,
        method: 'GET',
        headers: {
          Authorization: authToken
        },
        required_parameters: [
          {
            required_parm_name: 'order',
            required_parm_type: 'query',
            data_type: 'string',
            is_required: true,
            is_nullable: false,
            description: 'List all availanle bids for a specific order'
          }
        ],
        end_point_description: "Retrieve all bids for owner's cargo orders",
        end_point_creation_timestamp: '2024-12-19T10:17:39.301'
      }
    ];

    return {
      chatbotName: 'Sana AI',
      tone: 'professional and helpful',
      keywords: ['cargo', 'logistics', 'bidding', 'orders', 'tracking'],
      company_id: 'ac09411d-7370-4a10-a14a-045ee4c72071',
      sector: 'Logistics',
      task_description: 'chat',
      system_prompt: `You are a logistics support chat system to help manage cargo orders and bidding processes , the user you are chatting with now is called ${username}`,
      output_format_required: 'String',
      example_json_format: '',
      businessSystem: 'API',
      api_list: role === 'owner' ? ownerApiList : regularApiList,
      document_list: [],
      iat: Math.floor(Date.now() / 1000)
    };
  }



  private async encryptConfig(config: any): Promise<string> {
  try {
    // Create the JWT header with HS256 algorithm
    const header = {
      typ: 'JWT',
      alg: 'HS256'
    };

    // Convert header and payload to base64url strings using the helper
    const base64Header = base64urlEncode(JSON.stringify(header));
    const base64Payload = base64urlEncode(JSON.stringify(config));

    // Create the signing input
    const signingInput = `${base64Header}.${base64Payload}`;

    // Create key for HMAC-SHA256 using Web Crypto API
    const keyData = new TextEncoder().encode(this.jwtSecret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'HMAC',
        hash: { name: 'SHA-256' } // Specifies HS256
      },
      false,
      ['sign']
    );

    // Generate signature using HMAC-SHA256
    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      new TextEncoder().encode(signingInput)
    );

    // Convert signature to base64url using the helper function
    const signature = base64urlEncode(signatureBytes);

    // Return the complete JWT
    return `${base64Header}.${base64Payload}.${signature}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt config');
  }
}

  async sendMessage(
    message: string,
    authToken: string,
    role: string,
    username: string,
    conversationId: string
  ) {
    try {
      const config = this.generateChatbotConfig(
        `${authToken}`,
        // `Bearer ${authToken}`,
        role,
        username
      );
      const encryptedData = await this.encryptConfig(config);

      const response = await fetch(
        `${this.baseUrl}/action/chatbot?engine=${this.engineId}&conversation_id=${conversationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            message: message,
            data: encryptedData
          })
        }
      );

      // console.log('response', encryptedData);

      if (!response.ok) {
        console.error(
          'Failed to send message to chatbot:',
          response.statusText
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  }
}
