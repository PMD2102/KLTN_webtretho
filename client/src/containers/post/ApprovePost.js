import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import http from 'utils/http';

import UserInfoLayout from '../user-info/UserInfoLayout';
import UserInfoMenu from '../user-info/UserInfoMenu';
import imagePath from 'utils/imagePath';
import timeToDate from 'utils/timeToDate';
import ImageGrid from 'components/common/ImageGrid';
import convertToHTML from 'utils/convertToHTML';
import { FaFlag, FaRegComment } from 'react-icons/fa';
import { BiLike } from 'react-icons/bi';
import { FiShare } from 'react-icons/fi';

const ApprovePost = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [approvePosts, setApprovePosts] = useState([]);

  useEffect(() => {
    http
      .get('/posts/approve')
      .then(res => {
        setApprovePosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <UserInfoLayout>
      <Box flex="1" textAlign="left">
        {!loading ? (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Bài viết chờ duyệt
            </Text>
            <Text m="0.5em 0 2em 0">{approvePosts.length} Bài viết</Text>
            <Box>
              <Box>
                {!approvePosts.length ? (
                  <HStack>
                    <Image
                      boxSize="3em"
                      objectFit="cover"
                      src="https://www.webtretho.com/static/img/icon_check_approve.png"
                      alt="image"
                    />
                    <Text>Không có bài viết chờ duyệt!</Text>
                  </HStack>
                ) : (
                  approvePosts.slice(0, page * perPage).map(post => (
                    <VStack
                      key={post._id}
                      p="0.5em 1em"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      borderRadius="md"
                      my="1em"
                      align="flex-start"
                    >
                      {/* <Box>{post.author?.name}</Box> */}
                      <HStack align="flex-start">
                        <Image
                          boxSize="3em"
                          objectFit="cover"
                          src={imagePath(post.community?.avatar)}
                          alt="image"
                        />
                        <VStack align="flex-start">
                          <Text as="i" fontWeight="bold">
                            {post.community?.name}
                          </Text>
                          <Text as="i" fontSize="xs">
                            {timeToDate(post.createdAt)}
                          </Text>
                        </VStack>
                      </HStack>

                      <Text
                        fontSize="md"
                        className="three-line-text"
                        my="1em"
                        className="three-line-text"
                        dangerouslySetInnerHTML={convertToHTML(post.content)}
                      ></Text>
                      <ImageGrid
                        images={post.images?.map(img => imagePath(img))}
                      />
                      <HStack
                        borderTop="1px solid"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        justify="space-between"
                      >
                        <HStack spacing="16">
                          <HStack>
                            <Box
                              p="0.5em"
                              // onClick={() => handleLikeOrUnlike(post._id)}
                            >
                              <Icon
                                w="2em"
                                h="2em"
                                cursor="pointer"
                                _hover={{ color: 'blue.700' }}
                                as={BiLike}
                              />
                            </Box>
                            <Text>{post.totalLike}</Text>
                          </HStack>
                          <HStack>
                            <Box p="0.5em">
                              <Icon
                                w="2em"
                                h="2em"
                                cursor="pointer"
                                _hover={{ color: 'blue.700' }}
                                as={FaRegComment}
                              />
                            </Box>
                            <Text>{post.totalComment}</Text>
                          </HStack>
                          {/* <Box p="0.5em">
                            <Icon
                              w="2em"
                              h="2em"
                              cursor="pointer"
                              _hover={{ color: 'blue.700' }}
                              as={FaFlag}
                            />
                          </Box> */}
                        </HStack>

                        {/* <Box p="0.5em">
                          <Icon
                            w="2em"
                            h="2em"
                            cursor="pointer"
                            _hover={{ color: 'blue.700' }}
                            as={FiShare}
                          />
                        </Box> */}
                      </HStack>
                      {/* comments */}
                      {/* <HStack align="flex-start" my="0.5em">
                <Avatar size="sm" name="User 1" src="" />
                <Box flex="1" p="0.5em" borderRadius="md" bg="gray.100">
                  <Text fontWeight="600">nhunggha</Text>
                  <Text>
                    hay lắm chàng trai ơi, dù bạn có đẹp đến đâu mà bản tính bừa
                    bộn, không thích dọn dẹp và không biết nấu nướng thì chàng
                    trai nào cũng
                  </Text>
                </Box>
              </HStack> */}
                    </VStack>
                  ))
                )}
              </Box>
            </Box>
            {page * perPage < approvePosts.length && (
              <HStack justify="center">
                <Button
                  colorScheme="blue"
                  fontWeight="600"
                  p="0.5em"
                  cursor="pointer"
                  onClick={() =>
                    page * perPage < approvePosts.length &&
                    setPage(preState => ++preState)
                  }
                >
                  Xem thêm
                </Button>
              </HStack>
            )}
          </>
        ) : (
          <Box>Loading</Box>
        )}
      </Box>
      <UserInfoMenu></UserInfoMenu>
    </UserInfoLayout>
  );
};

export default ApprovePost;
